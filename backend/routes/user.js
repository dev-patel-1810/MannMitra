import { Router } from "express";
import {register_stud_user} from "../controllers/index_stud.js"
import {register_clg_user} from "../controllers/index_clg.js"
import {register_counselor_user} from "../controllers/index_conselor.js"

const router = Router()

router.route("/user-signup").post(register_stud_user)
router.route("/college-signup").post(register_clg_user)
router.route("/counsellor-signup").post(register_counselor_user)

export default router