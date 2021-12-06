import React, { ReactNode, useCallback, useRef, useState } from "react";
import { useCheng } from "./Cheng";
import { Tree, Button, Dropdown, Menu } from "antd";
import { isEmpty, isArray } from "lodash";
import { ElementConfigBase } from "@react-start/cheng-high";
import { ElementsModal } from "./Elements";
import { addElement, generateId, removeElement, withoutMenuItemBubble } from "./util";
import { IElement } from "./types";

export const ConfigTree = ({ treeWidth = 320, extra }: { treeWidth?: string | number; extra?: ReactNode }) => {
  const { configData, onConfigChange, setCurrentElement } = useCheng();

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

  const handleRemoveElement = (oid: string) => {
    if (!configData || !onConfigChange) {
      return;
    }
    const nextConfig = {
      ...configData,
      page: removeElement(isArray(configData.page) ? configData.page : [configData.page], oid),
    };
    onConfigChange(nextConfig);
  };

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
        treeData={isArray(configData.page) ? configData.page : ([configData.page] as any)}
        fieldNames={{
          key: "oid",
          title: "elementType$",
          children: "elementList",
        }}
        titleRender={(nodeData: ElementConfigBase | any) => {
          return (
            <div
              onClick={() => {
                setCurrentElement(nodeData);
              }}>
              {nodeData.elementType$}
              <Dropdown
                overlay={
                  <Menu>
                    {isArray(nodeData.elementList) && (
                      <Menu.Item
                        key={"addSub"}
                        onClick={withoutMenuItemBubble(() => {
                          targetElementOid.current = nodeData.oid;
                          setAddVisible(true);
                        })}>
                        添加子元素
                      </Menu.Item>
                    )}
                    <Menu.Item
                      key={"delete"}
                      onClick={withoutMenuItemBubble(() => {
                        handleRemoveElement(nodeData.oid);
                      })}>
                      删除
                    </Menu.Item>
                  </Menu>
                }>
                <a
                  css={{ position: "absolute", right: 0 }}
                  className="ant-dropdown-link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  操作
                </a>
              </Dropdown>
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
