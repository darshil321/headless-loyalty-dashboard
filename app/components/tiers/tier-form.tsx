import React, { useEffect } from "react";
import { Formik, Form as FormikForm, FieldArray } from "formik";
import * as Yup from "yup";
import {
  TextField as PolarisTextField,
  Select as PolarisSelect,
  Card,
  Layout,
  Page,
  Checkbox,
  Button,
} from "@shopify/polaris";
import { useAppDispatch } from "@/store/hooks";
import { createLoyaltyTier, updateLoyaltyTier } from "@/store/tier/tierSlice";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useNavigate } from "@remix-run/react";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
  default: Yup.boolean(),
  rules: Yup.array().of(
    Yup.object({
      ruleType: Yup.string().required("Rule type is required"),
      operator: Yup.string().required("Operator is required"),
      value: Yup.number().required("Value is required"),
    }),
  ),
  benefits: Yup.array().of(
    Yup.object({
      benefitType: Yup.string().required("Benefit type is required"),
      description: Yup.string().required("Description is required"),
      criteria: Yup.string().required("Criteria is required"),
      value: Yup.number().required("Value is required"),
    }),
  ),
});

const TierForm = ({ tierData, actionData, isUpdate }: any) => {
  const [submitted, setSubmitted] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
    }
  }, [submitted]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const submitTierData = async (values: any) => {
    try {
      setSubmitted(!submitted);
      if (isUpdate) {
        const { id, ...restValues } = values;
        const _values = { loyaltyTier: restValues, id };
        await dispatch(updateLoyaltyTier(_values)); // Dispatch update action
      } else {
        await dispatch(createLoyaltyTier(values)); // Dispatch create action
      }
      navigate("/tiers");
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <Formik
      initialValues={{
        name: tierData?.name || "",
        description: tierData?.description || "",
        status: tierData?.status || "inactive",
        default: tierData?.default || false,
        rules: tierData?.rules || [{ ruleType: "", operator: "", value: "0" }],
        benefits: tierData?.benefits || [
          { benefitType: "", description: "", criteria: "", value: "0" },
        ],
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        console.log("values", values);
        await submitTierData(values);
        setSubmitting(false);
        resetForm();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <FormikForm>
          <Page
            title="Tiers"
            primaryAction={{
              content: tierData ? "Save Tier" : "Create Tier",
              onAction: handleSubmit,
              loading: isSubmitting,
            }}
          >
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <div>
                    <PolarisTextField
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "name",
                            value: value,
                          },
                        })
                      }
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                    />
                  </div>
                  <div className="mt-5">
                    <PolarisTextField
                      label="Description"
                      multiline={4}
                      name="description"
                      value={values.description}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "description",
                            value: value,
                          },
                        })
                      }
                      onBlur={handleBlur}
                      error={touched.description && errors.description}
                    />
                  </div>
                  <div className="mt-5">
                    <PolarisSelect
                      label="Status"
                      name="status"
                      options={[
                        { label: "Active", value: "ACTIVE" },
                        { label: "Inactive", value: "INACTIVE" },
                      ]}
                      value={values.status}
                      onChange={(value) => {
                        handleChange({
                          target: { name: "status", value: value },
                        });
                      }}
                      error={touched.status && errors.status}
                    />
                  </div>
                  <div className="mt-5">
                    <Checkbox
                      label="Default"
                      name="default"
                      checked={values.default}
                      onChange={(checked, id) => {
                        // Directly handle the change with Formik's setFieldValue
                        setFieldValue("default", checked);
                      }}
                    />
                  </div>

                  <div className="mt-5">
                    <FieldArray name="rules">
                      {(arrayHelpers) => (
                        <>
                          {values.rules.map((rule: any, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-12 gap-3 items-end mt-3"
                            >
                              <div className="col-span-3">
                                <PolarisSelect
                                  label="Rule Type"
                                  name={`rules[${index}].ruleType`}
                                  options={[
                                    { label: "Select Type", value: "" },
                                    { label: "Points", value: "points" },
                                  ]}
                                  value={values.rules[index].ruleType}
                                  onChange={(value) => {
                                    console.log("value", value);
                                    setFieldValue(
                                      `rules[${index}].ruleType`,
                                      value,
                                    );
                                  }}
                                  error={
                                    touched.rules?.[index]?.ruleType &&
                                    errors.rules?.[index]?.ruleType
                                  }
                                />
                              </div>
                              <div className="col-span-3">
                                <PolarisSelect
                                  label="Operator"
                                  name={`rules[${index}].operator`}
                                  options={[
                                    { label: "Select Operator", value: "" },
                                    { label: ">", value: ">" },
                                    { label: "<", value: "<" },
                                  ]}
                                  value={values.rules[index].operator}
                                  onChange={(value) => {
                                    console.log("value", value);
                                    setFieldValue(
                                      `rules[${index}].operator`,
                                      value,
                                    );
                                  }}
                                  error={
                                    touched.rules?.[index]?.operator &&
                                    errors.rules?.[index]?.operator
                                  }
                                />
                              </div>
                              <div className="col-span-3">
                                <PolarisTextField
                                  label="Value"
                                  name={`rules[${index}].value`}
                                  type="number"
                                  value={values.rules[index].value?.toString()}
                                  onChange={(value) => {
                                    const numericValue =
                                      value === "" ? "" : Number(value);
                                    setFieldValue(
                                      `rules[${index}].value`,
                                      numericValue,
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  error={
                                    touched.rules?.[index]?.value &&
                                    errors.rules?.[index]?.value
                                  }
                                />
                              </div>
                              <div className="col-span-3">
                                <Button
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3">
                            <Button
                              onClick={() =>
                                arrayHelpers.push({
                                  ruleType: "",
                                  operator: "",
                                  value: 0,
                                })
                              }
                            >
                              Add Rule
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>

                  <div className="mt-5">
                    <FieldArray name="benefits">
                      {(arrayHelpers) => (
                        <>
                          {values.benefits.map(
                            (benefit: any, index: number) => (
                              <div
                                key={index}
                                className="w-full grid grid-cols-12 gap-3 items-end mt-3"
                              >
                                <div className="col-span-4">
                                  <PolarisSelect
                                    label="Benefit Type"
                                    name={`benefits[${index}].benefitType`}
                                    options={[
                                      {
                                        label: "Select Type",
                                        value: "",
                                      },
                                      { label: "Shipping", value: "shipping" },
                                      { label: "Discount", value: "discount" },
                                    ]}
                                    value={values.benefits[index].benefitType}
                                    onChange={(value) =>
                                      setFieldValue(
                                        `benefits[${index}].benefitType`,
                                        value,
                                      )
                                    }
                                    error={
                                      touched.benefits?.[index]?.benefitType &&
                                      errors.benefits?.[index]?.benefitType
                                    }
                                  />
                                </div>
                                <div className="col-span-2">
                                  <PolarisTextField
                                    label="Description"
                                    name={`benefits[${index}].description`}
                                    value={values.benefits[index].description}
                                    onChange={(value) =>
                                      setFieldValue(
                                        `benefits[${index}].description`,
                                        value,
                                      )
                                    }
                                    onBlur={handleBlur}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <PolarisSelect
                                    label="Criteria"
                                    name={`benefits[${index}].criteria`}
                                    options={[
                                      {
                                        label: "Select Criteria",
                                        value: "",
                                      },
                                      {
                                        label: "Order Value",
                                        value: "order_value",
                                      },
                                      {
                                        label: "Total Order",
                                        value: "total_order",
                                      },
                                    ]}
                                    value={values.benefits[index].criteria}
                                    onChange={(value) =>
                                      setFieldValue(
                                        `benefits[${index}].criteria`,
                                        value,
                                      )
                                    }
                                    error={
                                      touched.benefits?.[index]?.criteria &&
                                      errors.benefits?.[index]?.criteria
                                    }
                                  />
                                </div>
                                <div className="col-span-2">
                                  <PolarisTextField
                                    label="Value"
                                    name={`benefits[${index}].value`}
                                    type="number"
                                    value={values.benefits[
                                      index
                                    ].value?.toString()}
                                    onChange={(value) => {
                                      const numericValue =
                                        value === "" ? "" : Number(value);

                                      // Directly set the field value, ensuring it's treated as a numeric type
                                      setFieldValue(
                                        `benefits[${index}].value`,
                                        numericValue,
                                      );
                                    }}
                                    onBlur={handleBlur}
                                    error={
                                      touched.benefits?.[index]?.value &&
                                      errors.benefits?.[index]?.value
                                    }
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Button
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ),
                          )}
                          <div className="mt-3">
                            <Button
                              onClick={() =>
                                arrayHelpers.push({
                                  benefitType: "",
                                  description: "",
                                  criteria: "",
                                  value: 0,
                                })
                              }
                            >
                              Add Benefit
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>

                  {/* <div className="flex justify-end mt-5">
                    <PolarisButton submit variant="primary">
                      {tierData ? "Update Tier" : "Create Tier"}
                    </PolarisButton>
                  </div> */}
                  {actionData?.error && <p>Error: {actionData.error}</p>}
                </Card>
              </Layout.Section>
            </Layout>
          </Page>
        </FormikForm>
      )}
    </Formik>
  );
};

export default TierForm;
