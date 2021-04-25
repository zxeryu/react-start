import React, { useMemo, useRef, useState } from "react";
import {
  BaseForm,
  BaseFormItem,
  CheckboxGroup,
  Form,
  FormItem,
  IFormik,
  TMode,
  useBaseForm,
  SearchForm,
  SimpleSearchForm,
  RadioGroup,
} from "@react-start/components";
import { Button, MenuItem, Select, Switch, TextField } from "@material-ui/core";
import * as yup from "yup";
import { Rating } from "@material-ui/lab";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
});

const ChildSubmit = () => {
  const { form } = useBaseForm();
  return (
    <Button
      color="primary"
      variant="contained"
      fullWidth
      onClick={() => {
        form.submitForm();
      }}>
      Submit Child
    </Button>
  );
};

const BaseFormDemo = () => {
  const formRef = useRef<IFormik | undefined>();
  return (
    <div>
      BaseFormDemo
      <BaseForm
        formRef={formRef}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("@@@@@@@@", values);
        }}>
        <BaseFormItem name={"email"} fullWidth>
          <TextField label={"Email"} />
        </BaseFormItem>
        <BaseFormItem name={"password"} fullWidth>
          <TextField label={"Password"} required />
        </BaseFormItem>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>

        <ChildSubmit />
      </BaseForm>
      <Button
        color="primary"
        variant={"contained"}
        fullWidth
        onClick={() => {
          formRef.current?.submitForm();
        }}>
        Submit ref
      </Button>
    </div>
  );
};
const RecommendFormDemo = () => {
  const [mode, setMode] = useState<TMode>("horizontal");

  const { labelStyle, inputStyle } = useMemo(() => {
    if (mode === "inline") {
      return {
        labelStyle: {},
        inputStyle: {
          minWidth: "6em",
        },
      };
    } else if (mode === "horizontal") {
      return {
        labelStyle: { width: "8em", textAlign: "right" },
        inputStyle: { width: "20em" },
      };
    }
    return {
      labelStyle: {},
      inputStyle: { width: "20em" },
    };
  }, [mode]);

  return (
    <div>
      FormDemo
      <RadioGroup
        row
        options={[
          { label: "horizontal", value: "horizontal" },
          { label: "vertical", value: "vertical" },
          { label: "inline", value: "inline" },
        ]}
        value={mode}
        onChange={(e) => {
          setMode(e.target.value as TMode);
        }}
      />
      <Form
        mode={mode}
        labelStyle={labelStyle as any}
        inputStyle={inputStyle}
        initialValues={{
          select: "",
          selectMulti: [],
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}>
        <FormItem name={"email"} label={"email"}>
          <TextField />
        </FormItem>
        <FormItem name={"password"} label={"password"}>
          <TextField />
        </FormItem>
        <FormItem name={"select"} label={"Select"}>
          <Select>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormItem>
        <FormItem name={"selectMulti"} label={"Select multi"}>
          <Select multiple>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormItem>
        <FormItem name={"number"} label={"number"} inputStyle={{ width: "10em" }}>
          <TextField type={"number"} />
        </FormItem>
        <FormItem name={"switch"} label={"switch"}>
          <Switch />
        </FormItem>
        <FormItem name={"radio"} label={"radio"}>
          <RadioGroup
            row
            options={[
              { label: "one", value: "one" },
              { label: "two", value: "two" },
              { label: "three", value: "three" },
            ]}
          />
        </FormItem>
        <FormItem name={"checkbox"} label={"checkbox"} directChange>
          <CheckboxGroup
            row
            options={[
              { label: "one", value: "one" },
              { label: "two", value: "two" },
              { label: "three", value: "three" },
            ]}
          />
        </FormItem>
        <FormItem name={"rating"} label={"rating"}>
          <Rating />
        </FormItem>
        <FormItem>
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export const SearchFormDemo = () => {
  const [state, setState] = useState();
  console.log("@@@@@@@@", state);
  return (
    <div>
      SearchForm
      <SearchForm
        initialValues={{ select: "", search: "" }}
        state={state}
        setFilter={setState}
        debounceKeys={["search"]}>
        <FormItem name={"search"} label={"输入框"}>
          <TextField />
        </FormItem>
        <FormItem name={"select"} label={"选择框"}>
          <Select>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormItem>
      </SearchForm>
    </div>
  );
};

export const SimpleSearchFormDemo = () => {
  const [state, setState] = useState();
  console.log("@@@@@@@@simple=", state);
  return (
    <div>
      SimpleSearchForm
      <SimpleSearchForm state={state} setFilter={setState} debounceKeys={["search"]}>
        <TextField
          key={"search"}
          data-form={{
            label: "输入框",
          }}
        />
        <Select
          key={"select"}
          data-form={{
            label: "选择框",
          }}>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </SimpleSearchForm>
    </div>
  );
};

export const FormDemo = () => {
  return (
    <>
      <BaseFormDemo />
      <RecommendFormDemo />
      <SearchFormDemo />
      <SimpleSearchFormDemo />
    </>
  );
};
