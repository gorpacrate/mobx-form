import { mount } from "enzyme";
import { runInAction } from "mobx";
import * as React from "react";
import { ReactForm } from "./ReactForm";
import { ReactFormStore } from "./ReactFormStore";

describe("react", () => {

  it("render", () => {
    const store = new ReactFormStore();
    const form = mount(<ReactForm store={store} />);

    expect(form.find(".error")).toHaveLength(1);
    expect(form.find(".string")).toHaveLength(0);

    runInAction(() => {
      store.fields.foo.value = "spam";
      store.fields.bar.value = true;
    });
    expect(form.find(".error")).toHaveLength(0);
    expect(form.find(".foo").props().value).toBe("spam");
    expect(form.find(".bar").props().checked).toBe(true);

    form.find(".bar").simulate("change", { target: { checked: false } });
    expect(store.fields.bar.value).toBe(false);

    form.find(".foo").simulate("change", { target: { value: "eggs" } });
    expect(store.fields.foo.value).toBe("eggs");

    form.find(".foo").simulate("change", { target: { value: "" } });
    expect(form.find(".error")).toHaveLength(1);

    store.fields.strings.value = ["foo", "bar", "spam", "eggs"];
    expect(form.find(".string")).toHaveLength(4);

    form.find(".string").last().simulate("change", { target: { value: "!!" } });
    expect(store.value).toEqual({
      bar: false,
      foo: "",
      strings: ["foo", "bar", "spam", "!!"],
    });
  });

});
