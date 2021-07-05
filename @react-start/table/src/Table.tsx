import React from "react";
import RCTable from "rc-table";
import { tableStyle } from "./style";

const columns = [
  { title: "title1", dataIndex: "a", key: "a", width: 100 },
  { id: "123", title: "title2", dataIndex: "b", key: "b", width: 100 },
  { title: "title3", dataIndex: "c", key: "c", width: 200 },
  {
    title: "Operations",
    dataIndex: "",

    key: "d",
    render: () => <a href="#">Delete</a>,
  },
];

const data = [
  { a: "123", key: "1" },
  { a: "cdd", b: "edd", key: "2" },
  { a: "1333", c: "eee", key: "3" },
];

export const Table = () => {
  return (
    <div style={{ clear: "both", maxWidth: "100%" }}>
      <RCTable {...{ css: tableStyle }} columns={columns} data={data} />
    </div>
  );
};
