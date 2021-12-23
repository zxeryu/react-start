import { ElementConfigBase } from "../../cheng-high";
import { Dropdown, Menu, Space, Tree } from "antd";
import { filter, get, isArray, isObject, keys, map, size } from "lodash";
import { withoutMenuItemBubble } from "./util";
import { DataNode } from "antd/es/tree";
import React, { useMemo } from "react";

const Operate = ({ nodeData, onOperate }: Pick<ITreeExtraProps, "nodeData" | "onOperate">) => {
  const menus = useMemo(() => {
    const menuList: { value: string; label: string }[] = [];

    isArray(nodeData.elementList) && menuList.push({ value: "addSub", label: "添加子元素" });
    menuList.push({ value: "delete", label: "删除" });
    menuList.push({ value: "jsonShow", label: "Json数据" });
    menuList.push({ value: "jsonEdit", label: "Json编辑" });

    return menuList;
  }, [nodeData]);

  return (
    <Dropdown
      overlay={
        <Menu>
          {map(menus, (menu) => (
            <Menu.Item
              key={menu.value}
              onClick={withoutMenuItemBubble(() => {
                onOperate(menu.value);
              })}>
              {menu.label}
            </Menu.Item>
          ))}
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
    return isObject(value);
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
  const treeData = useMemo(() => objectToTree(nodeData.elementProps$ || {}, "elementProps$"), [nodeData]);

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
            selectedKeys={[]}
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
  onStructureSelect: (path: string) => void;

  onOperate: (operateKey: string) => void;
}

export const TreeExtra = ({ nodeData, onOperate, onStructureSelect }: ITreeExtraProps) => {
  return (
    <div
      css={{ position: "absolute", right: 0 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <Space>
        <Structure nodeData={nodeData} onStructureSelect={onStructureSelect} />
        <Operate nodeData={nodeData} onOperate={onOperate} />
      </Space>
    </div>
  );
};
