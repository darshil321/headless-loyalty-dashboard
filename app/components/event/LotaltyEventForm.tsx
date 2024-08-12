import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { TextField, Page, Layout, Select, Card } from "@shopify/polaris";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createLoyaltyEvent,
  updateLoyaltyEvent,
} from "@/store/event/eventSlice";
import { getAllLoyaltyTiers } from "@/store/tier/tierSlice";

const LoyaltyEventForm = ({
  eventData,
  isUpdate,
}: {
  eventData?: any;
  isUpdate: boolean;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tiers = useAppSelector((state) => state.tier.loyaltyTiers);
  const eventType = useAppSelector((state) => state.event.selectedEvent);

  const tierOptions = tiers?.map((tier: any) => ({
    label: tier.name,
    value: tier.id,
  }));
  console.log("eventType", eventType);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getAllLoyaltyTiers());
    }
  }, [submitted]);

  const getValidationSchema = () => {
    let schema = {
      points: Yup.number()
        .required("Points are required")
        .min(0, "Points must be non-negative"),
      expiryDate: Yup.date().required("Expiry date is required"),
      type: Yup.string().required("Event type is required"),
      tierId: Yup.string().required("Tier is required"),
    };

    if (eventType !== "SIGN_UP") {
      schema = {
        ...schema,
        minOrderValue: Yup.number()
          .required("Minimum order value is required")
          .min(0, "Minimum order value must be non-negative"),
        maxOrderValue: Yup.number()
          .required("Maximum order value is required")
          .min(0, "Maximum order value must be non-negative"),
        spendingLimit: Yup.number()
          .required("Spending limit is required")
          .min(0, "Spending limit must be non-negative"),
        spendingType: Yup.string().required("Spending type is required"),
      };
    }

    return Yup.object(schema);
  };

  const submitEventData = async (values) => {
    try {
      setSubmitted(true);
      if (isUpdate) {
        const { id, ...restValues } = values;
        await dispatch(updateLoyaltyEvent({ id, ...restValues }));
      } else {
        await dispatch(createLoyaltyEvent(values));
      }
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error submitting event data:", error);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Formik
      initialValues={{
        points: eventData?.points + 0 || 0,
        expiryDate: eventData?.expiryDate || "",
        minOrderValue: eventData?.minOrderValue || null,
        maxOrderValue: eventData?.maxOrderValue || null,
        spendingLimit: eventData?.spendingLimit || null,
        spendingType: eventData?.spendingType || "",
        tierId: eventData?.tierId || "",
        type: eventData?.type || "",
      }}
      validationSchema={getValidationSchema()}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        submitEventData(values).then(() => {
          setSubmitting(false);
          resetForm();
        });
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <FormikForm>
          <Page
            title={isUpdate ? "Update Event" : eventType}
            fullWidth
            primaryAction={{
              content: isUpdate ? "Save Event" : "Create Event",
              onAction: handleSubmit,
              loading: isSubmitting,
            }}
          >
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <TextField
                    label="Points"
                    type="number"
                    name="points"
                    value={values.points}
                    onChange={(value) => {
                      handleChange({
                        target: { name: "points", value: value },
                      });
                    }}
                    onBlur={handleBlur}
                    error={touched.points && errors.points}
                  />
                  <TextField
                    label="Expiry Date"
                    type="date"
                    name="expiryDate"
                    value={values.expiryDate}
                    onChange={(value) => {
                      console.log("value", value);
                      handleChange({
                        target: { name: "expiryDate", value: value },
                      });
                    }}
                    onBlur={handleBlur}
                    error={touched.expiryDate && errors.expiryDate}
                  />
                  {eventType !== "SIGN_UP" && (
                    <>
                      <TextField
                        label="Minimum Order Value"
                        type="number"
                        name="minOrderValue"
                        value={values.minOrderValue}
                        onChange={(value) => {
                          console.log("value", value);
                          handleChange({
                            target: { name: "minOrderValue", value: value },
                          });
                        }}
                        onBlur={handleBlur}
                        error={touched.minOrderValue && errors.minOrderValue}
                      />
                      <TextField
                        label="Maximum Order Value"
                        type="number"
                        name="maxOrderValue"
                        value={values.maxOrderValue}
                        onChange={(value) => {
                          console.log("value", value);
                          handleChange({
                            target: { name: "maxOrderValue", value: value },
                          });
                        }}
                        onBlur={handleBlur}
                        error={touched.maxOrderValue && errors.maxOrderValue}
                      />
                      <Select
                        label="Spending Type"
                        name="spendingType"
                        options={[
                          { label: "Fixed", value: "FIXED" },
                          { label: "Percentage", value: "PERCENTAGE" },
                        ]}
                        value={values.spendingType}
                        onChange={(value) =>
                          handleChange({
                            target: { name: "spendingType", value: value },
                          })
                        }
                        error={touched.spendingType && errors.spendingType}
                      />
                      <TextField
                        label="Spending Limit"
                        type="number"
                        name="spendingLimit"
                        value={values.spendingLimit}
                        onChange={(value) =>
                          handleChange({
                            target: {
                              name: "spendingLimit",
                              value: value,
                            },
                          })
                        }
                        onBlur={handleBlur}
                        error={touched.spendingLimit && errors.spendingLimit}
                      />
                    </>
                  )}
                  <Select
                    label="Tier"
                    name="tierId"
                    options={tierOptions}
                    value={values.tierId}
                    onChange={(value) =>
                      handleChange({ target: { name: "tierId", value: value } })
                    }
                    error={touched.tierId && errors.tierId}
                  />
                  <Select
                    label="Type"
                    name="type"
                    placeholder="Select an option"
                    options={[
                      { label: "Credit", value: "CREDIT" },
                      { label: "Debit", value: "DEBIT" },
                    ]}
                    value={values.type}
                    onChange={(value) =>
                      handleChange({ target: { name: "type", value: value } })
                    }
                    error={touched.type && errors.type}
                  />
                </Card>
              </Layout.Section>
            </Layout>
          </Page>
        </FormikForm>
      )}
    </Formik>
  );
};

export default LoyaltyEventForm;
