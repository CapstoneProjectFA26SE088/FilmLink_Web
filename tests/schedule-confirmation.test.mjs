import assert from "node:assert/strict";
import { test } from "node:test";
import { scheduleConfirmationBody } from "../src/components/lab-owner/orders/schedule-confirmation.ts";

const proposed = "2026-11-28T12:30:00+07:00";

test("use the server proposal when the owner does not override it", () => {
	assert.deepEqual(scheduleConfirmationBody(proposed, ""), {});
});

test("accept the proposed instant or a later one across time zones", () => {
	assert.deepEqual(scheduleConfirmationBody(proposed, "2026-11-28T05:30:00Z"), { promisedReturnAt: "2026-11-28T05:30:00.000Z" });
	assert.deepEqual(scheduleConfirmationBody(proposed, "2026-11-29T12:30:00+07:00"), { promisedReturnAt: "2026-11-29T05:30:00.000Z" });
});

test("reject an earlier or invalid override and a missing proposal date", () => {
	assert.equal(scheduleConfirmationBody(proposed, "2026-11-28T05:29:59Z"), null);
	assert.equal(scheduleConfirmationBody(proposed, "invalid"), null);
	assert.equal(scheduleConfirmationBody(null, "2026-11-29T12:30:00+07:00"), null);
});
