import { useHighPage, HighAction, useDomEvent } from "@react-start/cheng-high";
import { useEffect } from "react";
import { slice } from "lodash";

const dataSource: any = [
  {
    id: 624748504,
    number: 6689,
    title: "🐛 [BUG]yarn install命令 antd2.4.5会报错",
    labels: [{ name: "bug", color: "error" }],
    state: "open",
    locked: false,
    comments: 1,
    created_at: "2020-05-26T09:42:56Z",
    updated_at: "2020-05-26T10:03:02Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624691229,
    number: 6688,
    title: "🐛 [BUG]无法创建工程npm create umi",
    labels: [{ name: "bug", color: "error" }],
    state: "open",
    locked: false,
    comments: 0,
    created_at: "2020-05-26T08:19:22Z",
    updated_at: "2020-05-26T08:19:22Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624674790,
    number: 6685,
    title: "🧐 [问题] build 后还存在 es6 的代码（Umi@2.13.13）",
    labels: [{ name: "question", color: "success" }],
    state: "open",
    locked: false,
    comments: 0,
    created_at: "2020-05-26T07:54:25Z",
    updated_at: "2020-05-26T07:54:25Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624620220,
    number: 6683,
    title: "2.3.1版本如何在业务页面修改头部状态",
    labels: [{ name: "question", color: "success" }],
    state: "open",
    locked: false,
    comments: 2,
    created_at: "2020-05-26T05:58:24Z",
    updated_at: "2020-05-26T07:17:39Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624592471,
    number: 6682,
    title: "hideChildrenInMenu设置后，子路由找不到了",
    labels: [{ name: "bug", color: "error" }],
    state: "open",
    locked: false,
    comments: 2,
    created_at: "2020-05-26T04:25:59Z",
    updated_at: "2020-05-26T08:00:51Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624556297,
    number: 6680,
    title: "🐛 [BUG]Umi UI 添加多个空白页，就会出错！把空白页都变成选中状态！",
    labels: [{ name: "bug", color: "error" }],
    state: "open",
    locked: false,
    comments: 0,
    created_at: "2020-05-26T02:13:47Z",
    updated_at: "2020-05-26T02:13:47Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624415799,
    number: 6678,
    title: "🐛 [BUG]第一次载入页面，菜单仅图标时，图标没有居中",
    labels: [{ name: "bug", color: "error" }],
    state: "open",
    locked: false,
    comments: 1,
    created_at: "2020-05-25T17:34:21Z",
    updated_at: "2020-05-26T03:05:55Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624300343,
    number: 6675,
    title: "build(deps-dev): bump eslint from 6.8.0 to 7.1.0",
    labels: [{ name: "dependencies", color: "default" }],
    state: "open",
    locked: false,
    comments: 0,
    created_at: "2020-05-25T13:27:09Z",
    updated_at: "2020-05-25T13:27:10Z",
    closed_at: null,
    author_association: "CONTRIBUTOR",
    pull_request: {
      url: "https://api.github.com/repos/ant-design/ant-design-pro/pulls/6675",
      html_url: "https://github.com/ant-design/ant-design-pro/pull/6675",
      diff_url: "https://github.com/ant-design/ant-design-pro/pull/6675.diff",
      patch_url: "https://github.com/ant-design/ant-design-pro/pull/6675.patch",
    },
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 624130987,
    number: 6674,
    title: "🧐 [问题] V4版本如何使用第三方的enhanceReduxMiddleware",
    labels: [{ name: "question", color: "success" }],
    state: "open",
    locked: false,
    comments: 3,
    created_at: "2020-05-25T08:20:31Z",
    updated_at: "2020-05-26T07:37:47Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  },
  {
    id: 623677811,
    number: 6663,
    title: "🐛 [BUG] 官网预览页面，第一次点击二级菜单，其父级菜单会收起，之后再次点击二级菜单，父菜单正常",
    state: "open",
    locked: false,
    comments: 1,
    created_at: "2020-05-23T15:00:49Z",
    updated_at: "2020-05-24T23:47:37Z",
    closed_at: null,
    author_association: "NONE",
    user: "chenshuai2144",
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    labels: [{ name: "question", color: "processing" }],
  },
];

const getDataFromServer = (pageSize: number, page: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = slice(dataSource, (page - 1) * pageSize, pageSize * page);
      resolve({ total: 10, data });
    }, 2000);
  });
};

const getData = ({
  params = { pageSize: 5, page: 1 },
  actionType,
  sendEvent,
}: {
  params?: { pageSize: number; page: number };
  actionType: string;
  sendEvent: (p: any) => void;
}) => {
  getDataFromServer(params?.pageSize, params?.page).then((data) => {
    sendEvent({ type: actionType, payload: data });
  });
};

export const ListEventHandler = () => {
  const { sendEvent, dispatch, stateRef } = useHighPage();

  useDomEvent((action: HighAction) => {
    console.log("@@@", action.type, action.payload);
    switch (action.type) {
      case "init": //页面初始化
        dispatch({ type: "loading", payload: true });
        getData({
          actionType: "server.listData",
          sendEvent,
        });
        break;
      case "server.listData": //服务回来的数据
        dispatch({ type: "loading", payload: false });
        dispatch({ type: "listData", payload: action.payload });
        break;
      case "table:pagination:onChange":
        dispatch({ type: "loading", payload: true });
        getData({
          params: { page: action.payload.page, pageSize: action.payload.pageSize },
          actionType: "server.listData",
          sendEvent,
        });
        break;
      case "table:pagination:onShowSizeChange": //一般不需要订阅
        dispatch({ type: "loading", payload: true });
        getData({
          params: { page: action.payload.current, pageSize: action.payload.size },
          actionType: "server.listData",
          sendEvent,
        });
        break;
      case "add:onClick":
        console.log("state====", stateRef.current);
        break;
      // case "store-test:onClick":
      //   dispatchStore("store-test", new Date().valueOf());
      //   break;
    }
  });

  useEffect(() => {
    sendEvent({ type: "init" });
  }, []);

  return null;
};
