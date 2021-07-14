const tableHeaderColor = "rgba(0,0,0,0.85)";
const tableFooterColor = "rgba(0,0,0,0.85)";
const tableBorderRadiusBase = "2px";
const tablePaddingVertical = "16px";
const tablePaddingHorizontal = "16px";
const tableHeaderBg = "#fafafa";
const borderColor = "#f0f0f0";

const paddingBase = `${tablePaddingVertical} ${tablePaddingHorizontal}`;

const ThTdBase = {
  position: "relative",
  padding: paddingBase,
  overflowWrap: "break-word",
};

const cellFixFirstLast = {
  overflow: "visible",

  ".ant-table-cell-content": {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const nestTableCommon = {
  ".ant-table": {
    margin: paddingBase,
    "tbody > tr:last-child > td": {
      borderBottom: 0,
      "first-child": {
        borderRadius: 0,
      },
      "last-child": {
        borderRadius: 0,
      },
    },
  },
};

export const tableStyle = {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  listStyle: "none",
  position: "relative",
  fontSize: 14,
  backgroundColor: "white",
  borderRadius: tableBorderRadiusBase,
  table: {
    width: "100%",
    textAlign: "left",
    borderRadius: `${tableBorderRadiusBase} ${tableBorderRadiusBase} 0 0`,
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  "thead > tr > th": ThTdBase,
  "tbody > tr > td": ThTdBase,
  "tfoot > tr > th": ThTdBase,
  "tfoot > tr > td": ThTdBase,
  "cell-ellipsis": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    wordBreak: "keep-all",

    ".ant-table-cell-fix-left-last": cellFixFirstLast,
    ".ant-table-cell-fix-right-first": cellFixFirstLast,

    ".ant-table-column-title": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      wordBreak: "keep-all",
    },
  },
  title: {
    padding: paddingBase,
  },
  footer: {
    padding: paddingBase,
    color: tableFooterColor,
  },
  thead: {
    tr: {
      th: {
        position: "relative",
        color: tableHeaderColor,
        fontWeight: 500,
        textAlign: "left",
        background: tableHeaderBg,
        borderBottom: `1px solid ${borderColor}`,
        transaction: "background 0.3s ease",

        "[colspan]:not([colspan='1'])": {
          textAlign: "center",
        },

        ":not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before":
          {
            position: "absolute",
            top: "50%",
            right: 0,
            width: 1,
            height: "1.6em",
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            transform: "translateY(-50%)",
            transition: "background-color 0.3s",
            content: `""`,
          },

        ".ant-table-selection-column::before": {
          position: "absolute",
          top: "50%",
          right: 0,
          width: 1,
          height: "1.6em",
          backgroundColor: "red",
          transform: "translateY(-50%)",
          transition: "background-color 0.3s",
          content: `""`,
        },
      },
    },
    "tr:not(:last-child) > th": {
      "[colspan]": {
        borderBottom: 0,
      },
    },
  },
  tbody: {
    tr: {
      td: {
        borderBottom: `1px solid ${borderColor}`,
        transaction: "background 0.3s",

        ".ant-table-wrapper:only-child": nestTableCommon,
        ".ant-table-expanded-row-fixed > .ant-table-wrapper:only-child": nestTableCommon,

        ".ant-table-row:hover": {
          td: {
            backgroundColor: tableHeaderBg,
          },
        },

        ".ant-table-row-selected": {
          td: {
            background: tableHeaderBg,
            borderColor: "rgba(0, 0, 0, 0.03)",
          },
          ":hover": {
            td: {
              backgroundColor: tableHeaderBg,
            },
          },
        },
      },
    },
  },
  summary: {
    background: "white",
    div: {
      boxShadow: `0 1px 0 ${borderColor}`,
    },
    tr: {
      th: {
        borderBottom: `1px solid ${borderColor}`,
      },
      td: {
        borderBottom: `1px solid ${borderColor}`,
      },
    },
  },
};
