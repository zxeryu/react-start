import { Table } from "@react-start/table";
import React from "react";

const columns = [
  // { title: "", dataIndex: "expand", width: 60 },
  { title: "title1", dataIndex: "a" },
  { title: "title2", dataIndex: "b" },
  { title: "title3", dataIndex: "c" },
  {
    title: "Operations",
    dataIndex: "",

    key: "d",
    render: () => <a href="#">Delete</a>,
  },
];

const data = [
  {
    a: "123",
    key: "1",
    description:
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
  },
  { a: "cdd", b: "edd", key: "2", description: "456" },
  { a: "1333", c: "eee", key: "3" },
];

export const TableRCDemo = () => {
  return (
    <div>
      <Table
        columns={columns}
        data={data}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
          rowExpandable: (record) => !!record.description,
        }}
      />
    </div>
  );
};
