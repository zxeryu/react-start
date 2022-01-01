import React, { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useCheng } from "./Cheng";
import { Tree, Button, TreeProps } from "antd";
import { isEmpty, isArray, map, set, get } from "lodash";
import { ElementConfigBase } from "@react-start/cheng-high";
import { ElementsModal } from "./Elements";
import { addElement, findTarget, generateId, removeElement } from "./util";
import { IElement } from "./types";
import { TreeExtra } from "./ConfigMenu";
import { DataNode } from "rc-tree/lib/interface";

const convertToNode = (elements: ElementConfigBase[]) => {
  return map(elements, (element) => {
    const item: DataNode = {
      key: element.oid,
      title: element.elementType$,
    };
    set(item, "props", element.elementProps$);
    if (isArray(element.elementList)) {
      item.children = convertToNode(element.elementList);
    }
    return item;
  });
};

const convertToElement = (nodes: DataNode[]) => {
  return map(nodes, (nodeData) => {
    const item: ElementConfigBase = {
      oid: nodeData.key as string,
      elementType$: nodeData.title as string,
      elementProps$: get(nodeData, "props"),
    };
    if (isArray(nodeData.children)) {
      item.elementList = convertToElement(nodeData.children);
    }
    return item;
  });
};

export const ConfigTree = ({ treeWidth = 320, extra }: { treeWidth?: string | number; extra?: ReactNode }) => {
  const { configData, onConfigChange, setCurrentElement } = useCheng();

  const treeData = useMemo(() => {
    if (!configData) {
      return undefined;
    }
    return convertToNode(isArray(configData.page) ? configData.page : [configData.page]);
  }, [configData]);

  //添加
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const targetElementOid = useRef<string | undefined>();

  const handleAddElement = useCallback(
    (el: IElement) => {
      if (!configData || !onConfigChange) {
        return;
      }
      const configElement: ElementConfigBase = {
        oid: `${el.name}-${generateId()}`,
        elementType$: el.name,
        elementProps$: {},
      };
      if (el.isContainer) {
        configElement.elementList = [];
      }
      const nextConfig = {
        ...configData,
        page: addElement(
          isArray(configData.page) ? configData.page : [configData.page],
          configElement,
          targetElementOid.current,
        ),
      };
      onConfigChange(nextConfig);
    },
    [configData],
  );

  const handleRemoveElement = useCallback(
    (oid: string) => {
      if (!configData || !onConfigChange) {
        return;
      }
      const nextConfig = {
        ...configData,
        page: removeElement(isArray(configData.page) ? configData.page : [configData.page], oid),
      };
      onConfigChange(nextConfig);
    },
    [configData],
  );

  const handleDrop: TreeProps["onDrop"] = useCallback(
    (info) => {
      if (!configData || !onConfigChange) {
        return;
      }

      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split("-");
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const data = isArray(configData.page) ? [...configData.page] : [configData.page];
      let dragObj;
      let dragArr: any;
      let dragIndex: any;
      findTarget(data, dragKey, (arr, index) => {
        // arr.splice(index, 1);
        dragArr = arr;
        dragIndex = index;
        dragObj = arr[index];
      });

      let dropObj: any;
      let dropArr: any;
      let dropIndex: any;
      findTarget(data, dropKey, (arr, index) => {
        dropArr = arr;
        dropIndex = index;
        dropObj = arr[index];
      });

      if (!dragObj || !dropObj) {
        return;
      }
      //删除拖动组件
      dragArr.splice(dragIndex, 1);

      if (!info.dropToGap) {
        dropObj.elementList = dropObj.elementList || [];
        // where to insert 示例添加到头部，可以是随意位置
        dropObj.elementList.unshift(dragObj);
      } else if (
        (info.node.props.elementList || []).length > 0 && // Has elementList
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        dropObj.elementList = dropObj.elementList || [];
        // where to insert 示例添加到头部，可以是随意位置
        dropObj.elementList.unshift(dragObj);
      } else {
        if (dropPosition === -1) {
          dropArr.splice(dropIndex, 0, dragObj);
        } else {
          dropArr.splice(dropIndex + 1, 0, dragObj);
        }
      }

      onConfigChange({
        ...configData,
        page: data,
      });
    },
    [configData],
  );

  if (!configData || isEmpty(configData)) {
    return null;
  }

  return (
    <div>
      <div css={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 10 }}>
        <Button
          type={"primary"}
          onClick={() => {
            targetElementOid.current = undefined;
            setAddVisible(true);
          }}>
          添加组件
        </Button>
        {extra}
      </div>
      <Tree
        css={{
          width: treeWidth,
          ".ant-tree-treenode": {
            width: treeWidth,
          },
          ".ant-tree-node-content-wrapper": {
            flex: 1,
          },
          marginTop: 10,
        }}
        draggable
        treeData={treeData}
        onDrop={handleDrop}
        titleRender={(node: DataNode) => {
          const nodeData: ElementConfigBase = {
            oid: node.key as string,
            elementType$: node.title as string,
            elementProps$: get(node, "props"),
          };
          if (isArray(node.children)) {
            nodeData.elementList = convertToElement(node.children);
          }
          return (
            <div
              css={{ display: "flex" }}
              onClick={() => {
                setCurrentElement(nodeData);
              }}>
              {nodeData.elementType$}

              <TreeExtra
                nodeData={nodeData}
                onOperate={(operateKey) => {
                  if (operateKey === "addSub") {
                    targetElementOid.current = nodeData.oid;
                    setAddVisible(true);
                  } else if (operateKey === "delete") {
                    handleRemoveElement(nodeData.oid);
                  } else if (operateKey === "jsonShow" || operateKey === "jsonEdit") {
                    setCurrentElement(nodeData, undefined, operateKey);
                  }
                }}
                onStructureSelect={(path) => {
                  setCurrentElement(nodeData, path);
                }}
              />
            </div>
          );
        }}
      />

      {addVisible && (
        <ElementsModal
          onSuccess={(el) => {
            setAddVisible(false);
            handleAddElement(el);
          }}
          onCancel={() => setAddVisible(false)}
        />
      )}
    </div>
  );
};
