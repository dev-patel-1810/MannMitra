import { Router } from "express";
import {register_stud_user, getUserInfo, getUserAppointments} from "../controllers/index_stud.js"
import {register_clg_user} from "../controllers/index_clg.js"
import {register_counselor_user, getCounsellors, getCounsellorAppointments} from "../controllers/index_conselor.js"
import {login_user} from "../controllers/login.js"
import {bookAppointment, getAppointments, updateAppointmentStatus} from "../controllers/appointment.js"
const router = Router()

router.route("/user-signup").post(register_stud_user)
router.route("/college-signup").post(register_clg_user)
router.route("/counsellor-signup").post(register_counselor_user)
router.route("/login").post(login_user)
router.route("/appointment").post(bookAppointment)
router.route("/appointment").get(getAppointments)
router.route("/appointment").put(updateAppointmentStatus)
router.route("/counsellors").get(getCounsellors)
router.route("/user/:userId").get(getUserInfo)
router.route("/user/appointments/:userId").get(getUserAppointments); 
router.route("/counsellor/appointments/:counselorId").get(getCounsellorAppointments); 
router.route("/counsellor/appointments/status/:appointmentId").put(updateAppointmentStatus);

export default router