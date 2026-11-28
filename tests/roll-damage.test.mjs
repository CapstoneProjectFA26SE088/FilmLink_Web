import assert from "node:assert/strict";
import test from "node:test";
import { buildRollDamageBody, validDamageNote } from "../src/lib/roll-damage.ts";

const jpeg = new File(["evidence"], "frame.jpg", { type: "image/jpeg" });

test("packs the documented JSON part and repeated photo fields", async () => {
	const png = new File(["evidence"], "roll.png", { type: "image/png" });
	const body = buildRollDamageBody("  Xước phim  ", [jpeg, png]);
	const metadata = body.get("data");
	assert.equal(metadata.type, "application/json");
	assert.deepEqual(JSON.parse(await metadata.text()), { damageNote: "Xước phim" });
	assert.deepEqual(body.getAll("photos").map((photo) => photo.name), ["frame.jpg", "roll.png"]);
});

test("validates the note and enforces evidence constraints", () => {
	for (const value of [null, "  ", "x".repeat(501)]) assert.equal(validDamageNote(value), false);
	assert.equal(validDamageNote("x".repeat(500)), true);
	for (const files of [[], [""], Array(11).fill(jpeg), [new File([], "empty.jpg", { type: "image/jpeg" })],
		[new File(["bad"], "a.gif", { type: "image/gif" })],
		[new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" })]]) {
		assert.throws(() => buildRollDamageBody("Xước phim", files));
	}
	assert.equal(buildRollDamageBody("Xước phim", Array(10).fill(jpeg)).getAll("photos").length, 10);
});
