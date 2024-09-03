import { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import {
  TextField as PolarisTextField,
  Select as PolarisSelect,
  Card,
  Layout,
  Page,
} from "@shopify/polaris";
import { useAppDispatch } from "@/store/hooks";

import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useNavigate } from "@remix-run/react";
import { updateLoyaltyConfig } from "@/store/config/configSlice";

const validationSchema = Yup.object({
  typeOfTime: Yup.string().required("value is required"),
  value: Yup.number().min(1).required("value is required"),
});

const TierUpdationForm = ({ config, actionData, isUpdate }: any) => {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
    }
  }, [submitted]);

  const submitConfigData = async (values: any) => {
    try {
      setSubmitted(!submitted);
      const { id, ...restValues } = values;

      const _values = {
        loyaltyConfig: { lastOrder: restValues, key: config.key },
        id: config.id,
      };
      await dispatch(updateLoyaltyConfig(_values));

      navigate("/settings");
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <Formik
      initialValues={{
        typeOfTime: config?.lastOrder?.typeOfTime,
        value: (config?.lastOrder.value as number) || 0,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values: any, { setSubmitting, resetForm }) => {
        console.log("values", values);

        await submitConfigData(values);
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
            title={"Edit Tier Conditions"}
            primaryAction={{
              content: "Save",
              onAction: handleSubmit,
              loading: isSubmitting,
            }}
            backAction={{
              onAction: () => navigate("/settings"),
            }}
          >
            <Layout>
              <Layout.Section>
                <Card>
                  <div>
                    <PolarisTextField
                      autoComplete="off"
                      label="value"
                      min={1}
                      name="value"
                      type="number"
                      placeholder="Enter value"
                      value={values.value}
                      onChange={(value) => {
                        handleChange({
                          target: { name: "value", value: value },
                        });
                      }}
                      error={touched.value && (errors.value as string)}
                    />
                  </div>
                  <div className="mt-5">
                    <PolarisSelect
                      label="Time"
                      name="typeOfTime"
                      placeholder="Select status"
                      options={[
                        { label: "Minutes", value: "MINUTES" },
                        { label: "Hours", value: "HOURS" },
                        { label: "Days", value: "DAYS" },
                        { label: "Months", value: "MONTHS" },
                        { label: "Years", value: "YEARS" },
                      ]}
                      value={values.typeOfTime}
                      onChange={(value) => {
                        handleChange({
                          target: { name: "typeOfTime", value: value },
                        });
                      }}
                      error={
                        touched.typeOfTime && (errors.typeOfTime as string)
                      }
                    />
                  </div>
                </Card>
              </Layout.Section>
            </Layout>
          </Page>
        </FormikForm>
      )}
    </Formik>
  );
};

export default TierUpdationForm;
