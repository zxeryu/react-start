import React, { useState } from "react";
import { Table, ColumnType } from "@react-start/components";
import { sortBy, reverse, get, size } from "lodash";

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

const createData = (name: string, calories: number, fat: number, carbs: number, protein: number): Data => {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
};

const dataSource = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];

const columns: ColumnType<Data>[] = [
  {
    title: "Dessert (100g serving)",
    dataIndex: "name",
    sort: true,
  },
  {
    title: "Calories",
    dataIndex: "calories",
    sort: true,
    CellProps: { align: "center" },
  },
  {
    title: <>Fat&nbsp;(g)</>,
    dataIndex: "fat",
    sort: true,
  },
  {
    title: <>Carbs&nbsp;(g)</>,
    dataIndex: "carbs",
    sort: true,
  },
  {
    title: <>Protein&nbsp;(g)</>,
    dataIndex: "protein",
  },
];

export const TableDemo = () => {
  const [data, setData] = useState(dataSource);
  const [selectedList, setSelectedList] = useState([]);

  return (
    <div css={{ padding: "0 2em" }}>
      TableDemo
      <Table
        orderNumber
        columns={columns}
        dataSource={data}
        rowKey={"name"}
        onSortChange={(direction, dataIndex) => {
          let list = sortBy(dataSource, (item) => get(item, dataIndex));
          if (direction === "desc") {
            list = reverse(list);
          }
          setData(list);
        }}
        pagination={{
          total: size(dataSource),
          showSizeChange: true,
        }}
        rowSection={{
          selectedList,
          onSelectChange: (list) => {
            setSelectedList(list as any);
          },
        }}
      />
    </div>
  );
};
