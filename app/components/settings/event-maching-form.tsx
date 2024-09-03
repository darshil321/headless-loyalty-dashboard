import { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { Select as PolarisSelect, Card, Layout, Page } from "@shopify/polaris";
import { useAppDispatch } from "@/store/hooks";

import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useNavigate } from "@remix-run/react";
import { updateLoyaltyConfig } from "@/store/config/configSlice";

const validationSchema = Yup.object({
  typeOfMatch: Yup.string().required("value is required"),
});

const EventMatchingForm = ({ config, actionData, isUpdate }: any) => {
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
        loyaltyConfig: { ...restValues, key: config.key },
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
        typeOfMatch: config.typeOfMatch,
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
            title={"Edit Condition"}
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
                  <div className="mt-5">
                    <PolarisSelect
                      label="Time"
                      name="typeOfMatch"
                      placeholder="Select status"
                      options={[
                        { label: "Minimum", value: "MIN" },
                        { label: "Maximum", value: "MAX" },
                      ]}
                      value={values.typeOfMatch}
                      onChange={(value) => {
                        handleChange({
                          target: { name: "typeOfMatch", value: value },
                        });
                      }}
                      error={
                        touched.typeOfMatch && (errors.typeOfMatch as string)
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

export default EventMatchingForm;
