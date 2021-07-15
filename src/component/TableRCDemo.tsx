import { Table } from "@react-start/components-table";
import React, { useEffect, useState } from "react";

const createData = (
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  description?: string,
) => {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    description,
  };
};

const dataSource = [
  createData(
    "Cupcake",
    305,
    3.7,
    67,
    4.3,
    "7月6日简报，星期二！\n" +
      "1、国家卫健委：全国新冠疫苗接种超13亿剂次；\n" +
      "2、全国共有13332个A级旅游景区，其中5A级景区302个；\n" +
      "3、风云三号E星发射成功，系全球首颗民用晨昏轨道气象卫星；\n" +
      "4、美国民调：30%美国人表示拒绝接种新冠疫苗；\n" +
      "5、邮储银行六项违规被银保监会罚没449万，2名责任人被警告；\n" +
      "6、文旅部：2020年国内旅游人次28.79亿，比上年下降52.1%；\n" +
      "7、中国快递业务量半年破500亿件，发往农村地区业务量占三成；\n" +
      "8、美媒：57岁全球首富贝佐斯退休，净资产达1970亿美元；\n" +
      "9、外媒：塔利班占领阿富汗多个重镇，数百政府军人员逃往邻国；\n" +
      "10、美国高温天气已致数十人死亡，数百人住院，有地区气温达47.8摄氏度；\n" +
      "11、世界银行报告：印度农村地区女方嫁妆约为男方彩礼7倍；\n" +
      "12、中国女排东京奥运会12人名单公布：朱婷、张常宁领衔；\n" +
      "【微语】本来无望的事，大胆尝试，往往能成功。——莎士比亚",
  ),
  createData("Donut", 452, 25.0, 51, 4.9, "456"),
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

const columns = [
  {
    title: "Dessert (100g serving)",
    dataIndex: "name",
  },
  {
    title: "Calories",
    dataIndex: "calories",
  },
  {
    title: <>Fat&nbsp;(g)</>,
    dataIndex: "fat",
  },
  {
    title: <>Carbs&nbsp;(g)</>,
    dataIndex: "carbs",
  },
  {
    title: <>Protein&nbsp;(g)</>,
    dataIndex: "protein",
  },
];

export const TableRCDemo = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  console.log("111111", page);

  useEffect(() => {
    if (page !== 1) {
      setTimeout(() => {
        setPage(1);
      }, 1000);
    }
  }, [page]);

  return (
    <div>
      <Table
        prefixCls={"ant-table"}
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
          rowExpandable: (record) => !!record.description,
        }}
        rowKey={"name"}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log("#########", selectedRowKeys, selectedRows);
          },
        }}
        pagination={{
          page: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          showSizeChange: true,
        }}
      />
    </div>
  );
};
