import React from "react";
import { Formik, Form as FormikForm, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  TextField as PolarisTextField,
  Button as PolarisButton,
  Select as PolarisSelect,
  Card,
  Layout,
  Page,
  Checkbox,
  Button,
} from "@shopify/polaris";
import { useAppDispatch } from "@/store/hooks";
import { createLoyaltyTier, updateLoyaltyTier } from "@/store/tier/tierSlice";

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
  const dispatch = useAppDispatch();
  const submitTierData = async (values: any) => {
    try {
      if (isUpdate) {
        const { id, ...restValues } = values;
        const _values = { loyaltyTier: restValues, id };
        await dispatch(updateLoyaltyTier(_values)); // Dispatch update action
      } else {
        await dispatch(createLoyaltyTier(values)); // Dispatch create action
      }
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
        rules: tierData?.rules || [{ ruleType: "", operator: "", value: 0 }],
        benefits: tierData?.benefits || [
          { benefitType: "", description: "", criteria: "", value: 0 },
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
        getFieldProps,
        isSubmitting,
        setFieldValue,
      }) => (
        <FormikForm>
          <Page
            title="Tiers"
            primaryAction={{
              content: "Save Tier",
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
                              <div className="col-span-5">
                                <PolarisSelect
                                  label="Rule Type"
                                  name={`rules[${index}].ruleType`}
                                  options={[
                                    { label: "Points", value: "points" },
                                  ]}
                                  {...getFieldProps(`rules[${index}].ruleType`)}
                                />
                              </div>
                              <div className="col-span-3">
                                <PolarisSelect
                                  label="Operator"
                                  name={`rules[${index}].operator`}
                                  options={[
                                    { label: ">", value: ">" },
                                    { label: "<", value: "<" },
                                  ]}
                                  {...getFieldProps(`rules[${index}].operator`)}
                                />
                              </div>
                              <div className="col-span-1">
                                <PolarisTextField
                                  label="Value"
                                  name={`rules[${index}].value`}
                                  type="number"
                                  onChange={(value) => {
                                    setFieldValue(
                                      `rules[${index}].value`,
                                      Number(value),
                                    );
                                  }}
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
                                      { label: "Shipping", value: "shipping" },
                                      { label: "Discount", value: "discount" },
                                    ]}
                                    {...getFieldProps(
                                      `benefits[${index}].benefitType`,
                                    )}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <PolarisTextField
                                    label="Description"
                                    name={`benefits[${index}].description`}
                                    onChange={(value) => {
                                      // Update Formik's state directly
                                      setFieldValue("description", value);
                                    }}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <PolarisSelect
                                    label="Criteria"
                                    name={`benefits[${index}].criteria`}
                                    options={[
                                      {
                                        label: "Order Value",
                                        value: "order_value",
                                      },
                                      {
                                        label: "Total Order",
                                        value: "total_order",
                                      },
                                    ]}
                                    {...getFieldProps(
                                      `benefits[${index}].criteria`,
                                    )}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <PolarisTextField
                                    label="Value"
                                    name={`benefits[${index}].value`}
                                    type="number"
                                    onChange={(value) => {
                                      setFieldValue(
                                        `benefits[${index}].value`,
                                        Number(value),
                                      );
                                    }}
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

                  <div className="flex justify-end mt-5">
                    <PolarisButton submit variant="primary">
                      {tierData ? "Update Tier" : "Create Tier"}
                    </PolarisButton>
                  </div>
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
