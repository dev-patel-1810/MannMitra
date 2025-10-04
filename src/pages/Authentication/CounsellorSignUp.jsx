import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertModal from '../../components/AlertModal/AlertModal'; // <--- NEW IMPORT
import './Authentication.css';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  

const CounsellorSignUp = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        pinCode: '',
        qualification: '',
        specialization: '',
        experience: '',
        password: '',
        confirmPassword: '',
        collegeId: ''
    });

    const [errors, setErrors] = useState({});
    
    // --- NEW STATE FOR MODAL ---
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const openAlertModal = (message) => {
        setAlertMessage(message);
        setIsAlertModalOpen(true);
    };

    const closeAlertModal = () => {
        setIsAlertModalOpen(false);
        setAlertMessage('');
    };
    // ---------------------------

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            phoneNumber: '',
            pinCode: '',
            qualification: '',
            experience: '',
            password: '',
            confirmPassword: '',
            collegeId: ''
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = t('common.username');
        if (!formData.email.trim()) newErrors.email = t('common.email');
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t('common.phonenumber');
        if (!formData.pinCode.trim()) newErrors.pinCode = t('common.pincode');
        if (!formData.qualification.trim()) newErrors.qualification = t('counselor.qualification');
        if (!formData.specialization.trim()) newErrors.specialization = t('counselor.specialization');
        if (!formData.experience.trim()) newErrors.experience = t('counselor.experience');

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!formData.password) {
            newErrors.password = t('common.pass_req');
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = t('common.pass_condition');
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('common.confirm_pass');
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('common.pass_mismatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        console.log("Counselor Signup : \n");
        console.log(formData);
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('https://mannmitra-v141.onrender.com/counsellor-signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                // --- START OF ROBUST ERROR HANDLING FIX ---
                let data = null;
                try {
                    data = await response.json();
                } catch (jsonError) {
                    if (!response.ok) {
                        openAlertModal(t('common.signup_fail_unreadable'));
                        return;
                    }
                    throw new Error('Signup successful but failed to parse response data.');
                }
                // --- END OF ROBUST ERROR HANDLING FIX ---

                if (!response.ok) {
                    // Use the specific error message from the backend (data.message)
                    openAlertModal(data.message || t('common.signup_fail'));
                    return;
                }

                resetForm();
                toast.success("Account Created Successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } catch (error) {
                // Network or unexpected error
                openAlertModal(t('common.error') + ': ' + error.message);
            }
        }
    };

    return (
        <div className="signup-container">
            <ToastContainer />
            <div className="signup-content">
                <div className="signup-image">
                    <h1>{t('common.welcome')}</h1>
                    <p>{t('common.welcome2')}</p>
                </div>
                
                <div className="signup-form">
                    <h2>{t('counselor.signup')}</h2>
                    <form onSubmit={handleSubmit}>
                        {/* ... Input Fields (omitted for brevity, use existing code) ... */}
                        
                        <input type="text" name="username" placeholder={t('common.username_placeholder')} value={formData.username} onChange={handleInputChange} className={errors.username ? 'error' : ''} />
                        {errors.username && <span className="error-message">{errors.username}</span>}

                        <input type="email" name="email" placeholder={t('common.email_placeholder')} value={formData.email} onChange={handleInputChange} className={errors.email ? 'error' : ''} />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                        
                        <div className="phone-input">
                            <select><option value="+91">+91</option></select>
                            <input type="tel" name="phoneNumber" placeholder={t('common.phone_placeholder')} value={formData.phoneNumber} onChange={handleInputChange} className={errors.phoneNumber ? 'error' : ''} />
                        </div>
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}

                        <input type="text" name="qualification" placeholder={t('counselor.qualification_placeholder')} value={formData.qualification} onChange={handleInputChange} className={errors.qualification ? 'error' : ''} />
                        {errors.qualification && <span className="error-message">{errors.qualification}</span>}

                        <input type="text" name="specialization" placeholder={t('counselor.specialization_placeholder')} value={formData.specialization} onChange={handleInputChange} className={errors.specialization ? 'error' : ''} />
                        {errors.specialization && <span className="error-message">{errors.specialization}</span>}

                        <input type="text" name="experience" placeholder={t('counselor.experience_placeholder')} value={formData.experience} onChange={handleInputChange} className={errors.experience ? 'error' : ''} />
                        {errors.experience && <span className="error-message">{errors.experience}</span>}

                        <input type="text" name="pinCode" placeholder={t('common.pincode_placeholder')} value={formData.pinCode} onChange={handleInputChange} className={errors.pinCode ? 'error' : ''} />
                        {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}

                        <input type="password" name="password" placeholder={t('common.password_placeholder')} value={formData.password} onChange={handleInputChange} className={errors.password ? 'error' : ''} />
                        {errors.password && <span className="error-message">{errors.password}</span>}

                        <input type="password" name="confirmPassword" placeholder={t('common.confirm_password_placeholder')} value={formData.confirmPassword} onChange={handleInputChange} className={errors.confirmPassword ? 'error' : ''} />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        
                        <input type="text" name="collegeId" placeholder={t('counselor.college_id_placeholder')} value={formData.collegeId} onChange={handleInputChange} />
                        
                        <div className="terms">
                            <p>{t('common.privacypolicy')}</p>
                        </div>

                        <button type="submit" className="signup-button">{t('common.signup')}</button>

                        <div className="login-link">
                            {t('common.have_account')} <a href="/login">{t('common.login')}</a>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* --- ALERT MODAL --- */}
            <AlertModal
                isOpen={isAlertModalOpen}
                onClose={closeAlertModal}
                message={alertMessage}
                title={alertMessage.includes('successful') ? 'Success' : 'Sign Up Error'}
                buttonText="OK"
            />
            {/* ------------------- */}
        </div>
    );
};

export default CounsellorSignUp;