import { createAuth } from "@taxfix-hack/auth";
import { createDb } from "@taxfix-hack/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);
