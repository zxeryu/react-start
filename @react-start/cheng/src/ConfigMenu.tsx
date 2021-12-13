import { ElementConfigBase } from "../../cheng-high";
import { Dropdown, Menu, Space, Tree } from "antd";
import { filter, get, isArray, isObject, keys, map, size } from "lodash";
import { withoutMenuItemBubble } from "./util";
import { DataNode } from "antd/es/tree";
import React, { useMemo } from "react";

const Operate = ({ nodeData, onAddChild, onRemove }: Pick<ITreeExtraProps, "nodeData" | "onAddChild" | "onRemove">) => {
  return (
    <Dropdown
      overlay={
        <Menu>
          {isArray(nodeData.elementList) && (
            <Menu.Item key={"addSub"} onClick={withoutMenuItemBubble(onAddChild)}>
              添加子元素
            </Menu.Item>
          )}
          <Menu.Item key={"delete"} onClick={withoutMenuItemBubble(onRemove)}>
            删除
          </Menu.Item>
        </Menu>
      }>
      <a
        className="ant-dropdown-link"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        操作
      </a>
    </Dropdown>
  );
};

const objectToTree = (obj: Object, parent: string): DataNode[] => {
  if (isArray(obj)) {
    return map(
      filter(obj, (item) => isObject(item)),
      (item, index) => {
        const nextParent = `${parent}${parent ? "." : ""}${index}`;
        const title = get(item, "title") || get(item, "name") || `${index}`;
        return {
          key: nextParent,
          title: `arr-${title}`,
          children: objectToTree(item, nextParent),
        };
      },
    );
  }

  const validList = filter(keys(obj), (key) => {
    const value = get(obj, key);
    if (isObject(value)) {
      return true;
    }
    return false;
  });

  return map(validList, (key) => {
    const value = get(obj, key);
    const nextParent = `${parent}${parent ? "." : ""}${key}`;

    const treeNode: DataNode = {
      key: nextParent,
      title: key,
    };

    let needChildren = true;
    if (key === "highConfig") {
      needChildren = false;
    }

    if (needChildren) {
      treeNode.children = objectToTree(value, nextParent);
    }

    return treeNode;
  });
};

const Structure = ({ nodeData, onStructureSelect }: Pick<ITreeExtraProps, "nodeData" | "onStructureSelect">) => {
  const treeData = useMemo(() => objectToTree(nodeData.elementProps$ || {}, ""), [nodeData]);

  if (size(treeData) <= 0) {
    return null;
  }

  return (
    <Dropdown
      overlay={
        <Menu>
          <Tree
            style={{ paddingRight: 10 }}
            treeData={treeData}
            onSelect={(selectedKeys) => {
              onStructureSelect(selectedKeys[0] as string);
            }}
          />
        </Menu>
      }>
      <a
        className="ant-dropdown-link"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        结构
      </a>
    </Dropdown>
  );
};

export interface ITreeExtraProps {
  nodeData: ElementConfigBase;
  onAddChild: () => void;
  onRemove: () => void;
  onStructureSelect: (path: string) => void;
}

export const TreeExtra = ({ nodeData, onAddChild, onRemove, onStructureSelect }: ITreeExtraProps) => {
  return (
    <div
      css={{ position: "absolute", right: 0 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <Space>
        <Structure nodeData={nodeData} onStructureSelect={onStructureSelect} />
        <Operate nodeData={nodeData} onAddChild={onAddChild} onRemove={onRemove} />
      </Space>
    </div>
  );
};
