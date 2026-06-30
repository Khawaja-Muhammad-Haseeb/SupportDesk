import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateTicketPage.module.css";
import { useTickets } from "../context/TicketContext";
import PageHeader from "../components/common/PageHeader";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import Dropdown from "../components/common/Dropdown";
import Button from "../components/common/Button";
import useFormValidation from "../hooks/useFormValidation";
import { InlineLoader } from "../components/common/Loader";

const INITIAL_VALUES = {
  customerName: "",
  customerEmail: "",
  subject: "",
  description: "",
  priority: "",
};

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitDetails, setSubmitDetails] = useState([]);
  const [success, setSuccess] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll, isValid, reset } =
    useFormValidation(INITIAL_VALUES);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitDetails([]);
    try {
      await addTicket(values);
      setSuccess(true);
      // Redirect to the ticket list after a successful creation.
      setTimeout(() => navigate("/tickets"), 800);
    } catch (err) {
      setSubmitError(err.message || "Failed to create ticket.");
      // Surface any field-level validation messages returned by the backend.
      if (Array.isArray(err.details)) {
        setSubmitDetails(
          err.details
            .map((d) => (d && d.msg ? d.msg : null))
            .filter(Boolean)
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="New Ticket"
        subtitle="Fill in the details to create a support ticket"
        action={
          <Button variant="secondary" onClick={() => navigate("/tickets")}>
            ← Back to Tickets
          </Button>
        }
      />

      <div className={styles.formCard}>
        {success && (
          <div className={styles.successBanner}>
            Ticket created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Information</h2>
            <div className={styles.row}>
              <Input
                label="Customer Name"
                id="customerName"
                name="customerName"
                type="text"
                placeholder="e.g. Alice Johnson"
                value={values.customerName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.customerName}
                touched={touched.customerName}
              />
              <Input
                label="Customer Email"
                id="customerEmail"
                name="customerEmail"
                type="email"
                placeholder="e.g. alice@example.com"
                value={values.customerEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.customerEmail}
                touched={touched.customerEmail}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ticket Details</h2>
            <Input
              label="Subject"
              id="subject"
              name="subject"
              type="text"
              placeholder="Brief description of the issue"
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.subject}
              touched={touched.subject}
            />

            <Textarea
              label="Description"
              id="description"
              name="description"
              placeholder="Describe the issue in detail (minimum 10 characters)..."
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
              rows={5}
              hint="Minimum 10 characters required"
              className={styles.textarea}
            />

            <Dropdown
              label="Priority"
              id="priority"
              name="priority"
              options={PRIORITY_OPTIONS}
              placeholder="Select priority level"
              value={values.priority}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.priority}
              touched={touched.priority}
              className={styles.priorityField}
            />
          </div>

          {submitError && (
            <div className={styles.errorBanner}>
              <span>{submitError}</span>
              {submitDetails.length > 0 && (
                <ul className={styles.errorList}>
                  {submitDetails.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => { reset(); }}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={!isValid || submitting}
              size="lg"
            >
              {submitting ? <><InlineLoader /> Creating...</> : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
