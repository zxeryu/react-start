import { Modal, ModalProps, Empty, Typography, Button } from "antd";
import React, { useMemo } from "react";
import { IElement } from "./types";
import { useCheng } from "./Cheng";
import { groupBy, map, size, keys, get } from "lodash";

export const Elements = ({ onSelect }: { onSelect: (item: IElement) => void }) => {
  const { elements } = useCheng();

  const groupElements = useMemo(() => {
    const replenishElements = map(elements, (item) => {
      if (!item.group) {
        item.group = "extra";
      }
      return item;
    });
    return groupBy(replenishElements, "group");
  }, [elements]);

  const isSingleGroup = useMemo(() => {
    return size(keys(groupElements)) === 1;
  }, [groupElements]);

  return (
    <>
      {(!elements || size(elements) <= 0) && <Empty css={{ margin: "2em auto" }} />}

      <div css={{ maxHeight: "60vh", overflowY: "auto" }}>
        {map(keys(groupElements), (key) => {
          const group = get(groupElements, [key, 0, "group"]);
          const elements = get(groupElements, key);
          return (
            <React.Fragment key={group}>
              {!isSingleGroup && <Typography.Title level={4}>{group}</Typography.Title>}
              <div
                css={{
                  display: "flex",
                  flexWrap: "wrap",
                  ">*": {
                    marginRight: "1em",
                    marginBottom: "1em",
                  },
                }}>
                {map(elements, (el) => (
                  <Button
                    key={el.name}
                    onClick={() => {
                      onSelect && onSelect(el);
                    }}>
                    {el.name}
                  </Button>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export const ElementsModal = ({
  onSuccess,
  ...otherProps
}: ModalProps & {
  onSuccess: (element: IElement) => void;
}) => {
  return (
    <Modal visible width={800} title={"选择组件"} footer={null} {...otherProps}>
      <Elements
        onSelect={(el) => {
          onSuccess && onSuccess(el);
        }}
      />
    </Modal>
  );
};
