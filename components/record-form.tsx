"use client";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  UserRound,
  ClipboardList,
  Users,
  FileText,
  Save,
} from "lucide-react";
import { FormSteps } from "./save-confirmation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Draft,
  RecordItem,
  emptyPerson,
  validateDraft,
  duplicateCandidates,
  TODAY,
  formatDate,
} from "@/lib/jornada";

export function FormField({
  id,
  label,
  help,
  error,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {help ? <FieldDescription>{help}</FieldDescription> : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </Field>
  );
}
export function SelectField({
  id,
  value,
  options,
  onChange,
  invalid = false,
}: {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <NativeSelect
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid}
    >
      {options.map((option) => (
        <NativeSelectOption key={option} value={option}>
          {option || "Selecciona una opción"}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
export function RecordForm({
  draft,
  records,
  saveState,
  onChange,
  onSave,
  onBack,
  onOpen,
}: {
  draft: Draft;
  records: RecordItem[];
  saveState: string;
  onChange: (d: Draft) => void;
  onSave: (d: Draft) => void;
  onBack: () => void;
  onOpen: (id: string) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const isCase = draft.kind === "case";
  const candidates = duplicateCandidates(draft, records);
  function patch(values: Partial<Draft>) {
    onChange({ ...draft, ...values });
    setAcknowledged(false);
  }
  function advance() {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    if (draft.step < 2) patch({ step: draft.step + 1 });
    else onSave(draft);
  }
  const title =
    draft.step === 0
      ? isCase
        ? "Datos del caso"
        : "Nueva actuación"
      : draft.step === 1
        ? "Personas involucradas"
        : "Revisar antes de registrar";
  const HeadingIcon =
    draft.step === 0 ? ClipboardList : draft.step === 1 ? Users : FileText;
  return (
    <section className="form-page">
      <FormSteps step={draft.step} notary={!isCase} />
      <div className="form-title">
        <HeadingIcon />
        <h2>{title}</h2>
      </div>
      <p className="form-instruction">
        Los campos con * son obligatorios. Puedes continuar sin los datos
        opcionales.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          advance();
        }}
        noValidate
      >
        {draft.step === 0 ? (
          <FieldGroup>
            <div className="field-grid">
              <FormField
                id="date"
                label="Fecha de registro *"
                error={errors.date}
              >
                <Input
                  id="date"
                  type="date"
                  max={TODAY}
                  value={draft.date}
                  onChange={(e) => patch({ date: e.target.value })}
                  aria-invalid={Boolean(errors.date)}
                />
              </FormField>
              <FormField
                id="type"
                label={isCase ? "Tipo de conflicto *" : "Tipo de actuación *"}
                error={errors.type}
              >
                <SelectField
                  id="type"
                  value={draft.type}
                  invalid={Boolean(errors.type)}
                  options={
                    isCase
                      ? [
                          "",
                          "Vecinal",
                          "Familiar",
                          "Deudas",
                          "Terrenos o linderos",
                          "Daños",
                          "Otro",
                        ]
                      : [
                          "",
                          "Certificación de firmas",
                          "Constancia de posesión",
                          "Constancia de convivencia",
                          "Transferencia de bienes muebles",
                          "Otra actuación",
                        ]
                  }
                  onChange={(value) => patch({ type: value })}
                />
              </FormField>
            </div>
            {!isCase && draft.type ? (
              <p className="field-hint">
                {draft.type === "Certificación de firmas"
                  ? "Deja constancia de que una firma corresponde a la persona que la realiza."
                  : "Describe qué solicita la persona. Los tipos son ejemplos para esta demostración."}
              </p>
            ) : null}
            <FormField
              id="description"
              label={isCase ? "¿Qué ocurrió? *" : "¿Qué solicita la persona? *"}
              help={`${draft.description.length}/500 caracteres · Al menos 10 caracteres.`}
              error={errors.description}
            >
              <Textarea
                id="description"
                rows={4}
                maxLength={500}
                placeholder={
                  isCase
                    ? "Describe el conflicto con tus propias palabras…"
                    : "Describe brevemente la solicitud…"
                }
                value={draft.description}
                onChange={(e) => patch({ description: e.target.value })}
                aria-invalid={Boolean(errors.description)}
              />
            </FormField>
            <details className="optional-fields"><summary>Añadir observaciones (opcional)</summary>
            <FormField id="observations" label="Observaciones (opcional)">
              <Textarea
                id="observations"
                maxLength={1000}
                value={draft.observations}
                onChange={(e) => patch({ observations: e.target.value })}
                placeholder="Algo más que debas recordar"
              />
            </FormField></details>
          </FieldGroup>
        ) : null}
        {draft.step === 1 ? (
          <FieldGroup>
            {draft.people.map((person, index) => {
              const change = (values: Partial<typeof person>) =>
                patch({
                  people: draft.people.map((p, i) =>
                    i === index ? { ...p, ...values } : p,
                  ),
                });
              return (
                <fieldset className="person-fields" key={index}>
                  <legend>
                    <UserRound size={18} />
                    Persona {index + 1}
                  </legend>
                  <FieldGroup>
                    <div className="field-grid">
                      <FormField
                        id={`name${index}`}
                        label="Nombres y apellidos *"
                        error={errors[`name${index}`]}
                      >
                        <Input
                          id={`name${index}`}
                          value={person.name}
                          maxLength={100}
                          onChange={(e) => change({ name: e.target.value })}
                          aria-invalid={Boolean(errors[`name${index}`])}
                        />
                      </FormField>
                      <FormField id={`role${index}`} label="Participación *">
                        <SelectField
                          id={`role${index}`}
                          value={person.role}
                          options={
                            isCase
                              ? ["Solicitante", "Invitado", "Testigo"]
                              : ["Solicitante", "Declarante", "Testigo"]
                          }
                          onChange={(role) => change({ role })}
                        />
                      </FormField>
                    </div>
                    <div className="field-grid">
                      <FormField
                        id={`documentType${index}`}
                        label="Tipo de documento (si corresponde)"
                      >
                        <SelectField
                          id={`documentType${index}`}
                          value={person.documentType}
                          options={[
                            "Sin documento disponible",
                            "DNI",
                            "Otro documento",
                          ]}
                          onChange={(documentType) =>
                            change({ documentType, document: "" })
                          }
                        />
                      </FormField>
                      {person.documentType !== "Sin documento disponible" ? (
                        <FormField
                          id={`document${index}`}
                          label="Número de documento *"
                          error={errors[`document${index}`]}
                        >
                          <Input
                            id={`document${index}`}
                            value={person.document}
                            maxLength={person.documentType === "DNI" ? 8 : 30}
                            onChange={(e) =>
                              change({ document: e.target.value })
                            }
                            aria-invalid={Boolean(errors[`document${index}`])}
                          />
                        </FormField>
                      ) : null}
                    </div>
                    <div className="field-grid">
                      <FormField
                        id={`community${index}`}
                        label="Dirección o comunidad *"
                        error={errors[`community${index}`]}
                      >
                        <Input
                          id={`community${index}`}
                          value={person.community}
                          maxLength={150}
                          onChange={(e) =>
                            change({ community: e.target.value })
                          }
                          aria-invalid={Boolean(errors[`community${index}`])}
                        />
                      </FormField>
                      <FormField
                        id={`contact${index}`}
                        label="Teléfono o medio de contacto (opcional)"
                        help="Si no tiene teléfono, puedes dejarlo vacío."
                      >
                        <Input
                          id={`contact${index}`}
                          value={person.contact}
                          maxLength={150}
                          onChange={(e) => change({ contact: e.target.value })}
                        />
                      </FormField>
                    </div>
                    {index > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          patch({
                            people: draft.people.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <Trash2 data-icon="inline-start" />
                        Quitar esta persona
                      </Button>
                    ) : null}
                  </FieldGroup>
                </fieldset>
              );
            })}
            {errors.people ? (
              <p role="alert" className="error-text">
                {errors.people}
              </p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                patch({
                  people: [
                    ...draft.people,
                    { ...emptyPerson(), role: isCase ? "Invitado" : "Testigo" },
                  ],
                })
              }
            >
              <Plus data-icon="inline-start" />
              Añadir otra persona
            </Button>
          </FieldGroup>
        ) : null}
        {draft.step === 2 ? (
          <div className="review-content">
            <dl className="review-grid">
              <dt>Fecha</dt>
              <dd>{formatDate(draft.date)}</dd>
              <dt>Tipo</dt>
              <dd>{draft.type}</dd>
              <dt>Descripción</dt>
              <dd>{draft.description}</dd>
              <dt>Observaciones</dt>
              <dd>{draft.observations || "Sin observaciones"}</dd>
            </dl>
            {draft.people.map((p, i) => (
              <div className="review-person" key={i}>
                <strong>{p.name}</strong>
                <Badge variant="secondary">{p.role}</Badge>
                <p>
                  {p.community} · {p.contact || "Sin contacto disponible"}
                </p>
                <p>
                  {p.documentType}
                  {p.document ? `: ${p.document}` : ""}
                </p>
              </div>
            ))}
            {candidates.length ? (
              <Alert>
                <AlertTitle>
                  Hay registros parecidos. Revisa si es la misma solicitud.
                </AlertTitle>
                <AlertDescription>
                  Coinciden el tipo, una persona y una fecha cercana. Una
                  persona puede participar en más de un trámite.
                  {candidates.map((r) => (
                    <Button
                      key={r.id}
                      variant="outline"
                      type="button"
                      onClick={() => onOpen(r.id)}
                    >
                      Revisar {r.id}
                    </Button>
                  ))}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                    />
                    Es otra solicitud; quiero registrar una nueva.
                  </label>
                </AlertDescription>
              </Alert>
            ) : null}
            <p>
              Al confirmar se generará un código y se guardará el registro en
              esta tableta.
            </p>
          </div>
        ) : null}
        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              draft.step ? patch({ step: draft.step - 1 }) : onBack()
            }
          >
            <ArrowLeft data-icon="inline-start" />
            {draft.step ? "Volver" : "Guardar y salir"}
          </Button>
          <Button
            type="submit"
            disabled={
              draft.step === 2 && candidates.length > 0 && !acknowledged
            }
          >
            {draft.step < 2
              ? "Continuar"
              : isCase
                ? "Registrar caso"
                : "Registrar actuación"}
            {draft.step < 2 ? (
              <ArrowRight data-icon="inline-end" />
            ) : (
              <Check data-icon="inline-end" />
            )}
          </Button>
        </div>
      </form>
      <p className="draft-status" role="status">
        <Save size={17} />
        {saveState === "Guardando…"
          ? saveState
          : saveState === "No guardado"
            ? "No se pudo guardar el último cambio"
            : "Borrador guardado en esta tableta · Pendiente de sincronización"}
      </p>
    </section>
  );
}
