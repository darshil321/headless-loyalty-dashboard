import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";
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
  const _eventType = useAppSelector((state) => state.event.selectedEvent);
  const eventType = isUpdate ? eventData?.event : _eventType;

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
    let schema: any = {
      points: Yup.number()
        .required("Points are required")
        .min(0, "Points must be non-negative"),
      expiresInDays: Yup.date().required("Days is required"),
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

  const { eventId } = useParams();
  console.log("eventData", eventData);

  const submitEventData = async (values: any) => {
    try {
      setSubmitted(true);
      if (isUpdate) {
        const { maxOrderValue, minOrderValue, points, spendingLimit } = values;
        const valuesToSend = {
          ...values,
          event: eventData.event,
          points: parseInt(points),
          expiresInDays: values.expiresInDays,
        };

        if (minOrderValue && maxOrderValue) {
          valuesToSend.minOrderValue = parseInt(minOrderValue);
          valuesToSend.maxOrderValue = parseInt(maxOrderValue);
        }

        if (spendingLimit) {
          valuesToSend.spendingLimit = parseInt(spendingLimit);
        }
        const { id, ...restValues } = valuesToSend;
        await dispatch(
          updateLoyaltyEvent({ id: eventId, loyaltyEventData: restValues }),
        );
      } else {
        const { maxOrderValue, minOrderValue, points, spendingLimit } = values;

        const valuesToSend = {
          ...values,
          event: eventType,
          points: parseInt(points),
          expiresInDays: values.expiresInDays,
        };

        if (minOrderValue && maxOrderValue) {
          valuesToSend.minOrderValue = parseInt(minOrderValue);
          valuesToSend.maxOrderValue = parseInt(maxOrderValue);
        }

        if (spendingLimit) {
          valuesToSend.spendingLimit = parseInt(spendingLimit);
        }

        await dispatch(createLoyaltyEvent(valuesToSend));
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
        expiresInDays: eventData?.expiresInDays || "",
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
                  <div className="py-3">
                    <div className="grid grid-cols-4 gap-3 items-end">
                      <div className="col-span-2">
                        <Select
                          label="Tier"
                          name="tierId"
                          placeholder="Select Tier"
                          options={tierOptions}
                          value={values.tierId}
                          onChange={(value) =>
                            handleChange({
                              target: { name: "tierId", value: value },
                            })
                          }
                          error={touched.tierId && errors.tierId}
                        />
                      </div>
                      <div className="col-span-2">
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
                            handleChange({
                              target: { name: "type", value: value },
                            })
                          }
                          error={touched.type && errors.type}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 items-end mt-5">
                      <div className="col-span-2">
                        <TextField
                          label="Value (Fixed or Percentage)"
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
                      </div>
                      <div className="col-span-2">
                        <TextField
                          label="Expiry In Days"
                          type="number"
                          name="expiresInDays"
                          value={values.expiresInDays}
                          onChange={(value) => {
                            handleChange({
                              target: { name: "expiresInDays", value: value },
                            });
                          }}
                          onBlur={handleBlur}
                          error={touched.expiresInDays && errors.expiresInDays}
                        />
                      </div>
                    </div>

                    {eventType !== "SIGN_UP" && (
                      <>
                        <div className="grid grid-cols-4 gap-3 items-end mt-5">
                          <div className="col-span-2">
                            <TextField
                              label="Minimum Order Value"
                              type="number"
                              name="minOrderValue"
                              value={values.minOrderValue}
                              onChange={(value) => {
                                console.log("value", value);
                                handleChange({
                                  target: {
                                    name: "minOrderValue",
                                    value: value,
                                  },
                                });
                              }}
                              onBlur={handleBlur}
                              error={
                                touched.minOrderValue && errors.minOrderValue
                              }
                            />
                          </div>
                          <div className="col-span-2">
                            <TextField
                              label="Maximum Order Value"
                              type="number"
                              name="maxOrderValue"
                              value={values.maxOrderValue}
                              onChange={(value) => {
                                console.log("value", value);
                                handleChange({
                                  target: {
                                    name: "maxOrderValue",
                                    value: value,
                                  },
                                });
                              }}
                              onBlur={handleBlur}
                              error={
                                touched.maxOrderValue && errors.maxOrderValue
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3 items-end mt-5">
                          <div className="col-span-2">
                            <Select
                              label="Spending Type"
                              name="spendingType"
                              placeholder="Select Type"
                              options={[
                                { label: "Fixed", value: "FIXED" },
                                { label: "Percentage", value: "PERCENTAGE" },
                              ]}
                              value={values.spendingType}
                              onChange={(value) =>
                                handleChange({
                                  target: {
                                    name: "spendingType",
                                    value: value,
                                  },
                                })
                              }
                              error={
                                touched.spendingType && errors.spendingType
                              }
                            />
                          </div>
                          <div className="col-span-2">
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
                              error={
                                touched.spendingLimit && errors.spendingLimit
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
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

export default LoyaltyEventForm;
