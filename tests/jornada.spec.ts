import { test, expect, type Page } from "@playwright/test";

async function explore(page: Page) {
  await page.goto("/");
  await page
    .locator(".intro")
    .getByRole("button", { name: "Explorar libremente" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Buenos días, jueza" }),
  ).toBeVisible();
}
const navigation = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("button", { name: new RegExp("^" + name + "(?: \\d+)?$") });
const readDb = (page: Page) =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("mi-jornada:v1") || "null"),
  );

test("guided outage preserves focused draft; cases, linked agenda, and failed sync recover", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.screenshot({ path: "output/screenshots/01-oficina.png" });
  await page
    .locator(".intro")
    .getByRole("button", { name: "Vivir la jornada", exact: true })
    .click();
  await expect(
    page.getByText("«Queremos conversar sobre el lindero.»"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Usar la tableta" }).click();
  await page
    .getByRole("button", { name: "Mi jornada Justicia cercana" })
    .click();
  await page.getByRole("button", { name: "Ampliar", exact: true }).click();
  await page.screenshot({ path: "output/screenshots/02-inicio.png" });
  await page
    .getByRole("button", { name: "Registrar caso", exact: true })
    .click();
  await page
    .getByLabel("Tipo de conflicto *", { exact: true })
    .selectOption("Terrenos o linderos");
  const description = page.getByLabel("¿Qué ocurrió? *", { exact: true });
  await description.pressSequentially(
    "Mateo y Rosa tienen un desacuerdo sobre el lindero de sus terrenos.",
  );
  await expect(description).toBeFocused();
  await expect(
    page.getByText(
      "Se perdió la conexión. Puedes continuar: tus cambios se guardan en esta tableta.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Aplicaciones", exact: true }).click();
  await page
    .getByRole("button", { name: "Mi jornada Justicia cercana" })
    .click();
  await expect(description).toHaveValue(
    "Mateo y Rosa tienen un desacuerdo sobre el lindero de sus terrenos.",
  );
  // Real network loss, then browser reload, not only the scenario toggle.
  await page.getByRole("button", { name: "Opciones", exact: true }).click();
  await expect(
    page.getByText("Aplicación preparada para volver a abrirse sin conexión."),
  ).toBeVisible({ timeout: 15000 });
  await page.keyboard.press("Escape");
  await context.setOffline(true);
  await page.reload();
  await page
    .locator(".intro")
    .getByRole("button", { name: "Explorar libremente" })
    .click();
  await page.getByRole("button", { name: "Retomar caso", exact: true }).click();
  await expect(description).toHaveValue(
    "Mateo y Rosa tienen un desacuerdo sobre el lindero de sus terrenos.",
  );
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page
    .getByLabel("Nombres y apellidos *", { exact: true })
    .fill("Mateo Huamán");
  await page
    .getByLabel("Dirección o comunidad *", { exact: true })
    .fill("Santa Rosa");
  await page.getByRole("button", { name: "Añadir otra persona" }).click();
  await page.locator("#name1").fill("Rosa Flores");
  await page.locator("#community1").fill("Santa Rosa");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page
    .getByRole("button", { name: "Registrar caso", exact: true })
    .click();
  await expect(
    page.getByText("C-2026-0002", { exact: true }).first(),
  ).toBeVisible();
  let db = await readDb(page);
  expect(db.records).toHaveLength(3);
  expect(db.records[2].people[1].contact).toBe("");
  expect(db.drafts.case).toBeUndefined();
  await expect(page.getByRole("button", { name: "Ver caso", exact: true })).toBeInViewport();
  await page.screenshot({ path: "output/screenshots/03-confirmacion.png" });
  await page.getByRole("button", { name: "Ver caso", exact: true }).click();
  await page.screenshot({ path: "output/screenshots/03-detalle.png" });
  await page
    .getByRole("button", { name: "Agendar atención vinculada" })
    .click();
  await page.getByLabel("Fecha *", { exact: true }).fill("2026-05-15");
  await page.getByLabel("Hora de inicio (opcional)").fill("11:00");
  await page.getByLabel("Hora de término (opcional)").fill("12:00");
  await page
    .getByRole("button", { name: "Guardar actividad", exact: true })
    .click();
  db = await readDb(page);
  expect(db.activities[3].linkedId).toBe("C-2026-0002");
  expect(db.records[2].attentionDate).toBe("2026-05-15");
  await navigation(page, "Sincronización").click();
  await expect(
    page.getByRole("button", { name: "Sincronizar ahora", exact: true }),
  ).toBeDisabled();
  await context.setOffline(false);
  await page.getByRole("button", { name: "Opciones", exact: true }).click();
  await page.getByLabel("Simular un fallo en el próximo envío").check();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Sincronizar ahora", exact: true })
    .click();
  await expect(
    page.getByText("Sincronización interrumpida", { exact: true }),
  ).toBeVisible();
  db = await readDb(page);
  expect(db.records[2].pending).toBe(true);
  expect(db.activities[3].pending).toBe(true);
  await page
    .getByRole("button", { name: "Reintentar sincronización", exact: true })
    .click();
  await expect(
    page.getByText("Sincronización completada", { exact: true }),
  ).toBeVisible();
  db = await readDb(page);
  expect(db.records[2].pending).toBe(false);
  expect(db.activities[3].pending).toBe(false);
  await page.screenshot({ path: "output/screenshots/06-sincronizacion.png" });
  expect(errors).toEqual([]);
});

test("notarial duplicates require review, optional data stays optional and conclusion needs a result", async ({
  page,
}) => {
  await explore(page);
  await navigation(page, "Actuaciones notariales").click();
  await page
    .getByRole("button", { name: "Nueva actuación", exact: true })
    .click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(
    page.getByText("Selecciona el tipo de atención.", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Tipo de actuación *", { exact: true })
    .selectOption("Certificación de firmas");
  await page
    .getByLabel("¿Qué solicita la persona? *", { exact: true })
    .fill("Certificación de firma en una nueva declaración.");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page
    .getByLabel("Nombres y apellidos *", { exact: true })
    .fill("Lucía Torres");
  await page
    .getByLabel("Dirección o comunidad *", { exact: true })
    .fill("Santa Rosa");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Registrar actuación", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Revisar N-2026-0001", exact: true })
    .click();
  await expect(
    page.getByText("Firma de una declaración de entrega de herramientas", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Volver a registros", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Retomar borrador", exact: true })
    .click();
  await page
    .getByLabel("Es otra solicitud; quiero registrar una nueva.")
    .check();
  await page
    .getByRole("button", { name: "Registrar actuación", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ver actuación", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Actualizar estado", exact: true })
    .click();
  await page
    .getByLabel("Estado del trámite *", { exact: true })
    .selectOption("Concluida");
  await page
    .getByLabel("¿Qué se hizo? *", { exact: true })
    .fill("Se verificó y certificó la firma de la solicitante.");
  await page
    .getByRole("button", { name: "Revisar cambios", exact: true })
    .click();
  await expect(
    page.getByText("Escribe el resultado o acuerdo antes de concluir."),
  ).toBeVisible();
  await page
    .getByLabel("Resultado o acuerdo *", { exact: true })
    .fill("Firma certificada y documento entregado.");
  await page
    .getByRole("button", { name: "Revisar cambios", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirmar y guardar", exact: true })
    .click();
  const db = await readDb(page);
  const record = db.records.find((r: { id: string }) => r.id === "N-2026-0002");
  expect(record.status).toBe("Concluida");
  expect(record.result).toContain("Firma certificada");
  expect(record.pending).toBe(true);
  await page.screenshot({ path: "output/screenshots/04-notaria.png" });
});

test("calendar supports month, day, status changes and activity drafts survive reload", async ({
  page,
}) => {
  await explore(page);
  await navigation(page, "Agenda").click();
  await page.getByRole("tab", { name: "Mes", exact: true }).click();
  await expect(page.getByRole("button", { name: "31 de mayo, 0 actividades", exact: true })).toBeInViewport();
  await page.screenshot({ path: "output/screenshots/05-mes.png" });
  await page
    .getByRole("button", { name: "14 de mayo, 1 actividades", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Visita a la comunidad de Los Cedros" }),
  ).toBeVisible();
  await page
    .getByLabel("Estado de Visita a la comunidad de Los Cedros")
    .selectOption("Cancelada");
  await page.screenshot({ path: "output/screenshots/05-agenda.png" });
  await page
    .getByRole("button", { name: "Nueva actividad", exact: true })
    .click();
  await page
    .getByLabel("Nombre de la actividad *", { exact: true })
    .fill("Reunión de prueba conservada");
  await page.reload();
  await page
    .locator(".intro")
    .getByRole("button", { name: "Explorar libremente" })
    .click();
  await page
    .getByRole("button", { name: "Retomar actividad", exact: true })
    .click();
  await expect(
    page.getByLabel("Nombre de la actividad *", { exact: true }),
  ).toHaveValue("Reunión de prueba conservada");
  await page
    .getByLabel("Lugar o comunidad *", { exact: true })
    .fill("Local comunal");
  await page.getByLabel("Hora de inicio (opcional)").fill("12:00");
  await page.getByLabel("Hora de término (opcional)").fill("11:00");
  await page
    .getByRole("button", { name: "Guardar actividad", exact: true })
    .click();
  await expect(
    page.getByText("La hora de término debe ser posterior al inicio."),
  ).toBeVisible();
  await page.getByLabel("Hora de término (opcional)").fill("13:00");
  await page
    .getByRole("button", { name: "Guardar actividad", exact: true })
    .click();
  expect((await readDb(page)).activities).toHaveLength(4);
  await page
    .getByRole("button", { name: "Reiniciar demostración", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Conservar mi trabajo", exact: true })
    .click();
  expect((await readDb(page)).activities).toHaveLength(4);
});

test("small screen has no horizontal overflow and app navigation remains usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await explore(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await navigation(page, "Casos").click();
  await page.getByRole("button", { name: "Nuevo caso", exact: true }).click();
  await expect(
    page.getByLabel("¿Qué ocurrió? *", { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "output/screenshots/07-movil.png" });
});
