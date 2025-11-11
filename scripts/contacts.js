document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.createElement('div');
    formMessages.setAttribute('aria-live', 'polite');
    formMessages.setAttribute('aria-atomic', 'true');
    formMessages.className = 'alert alert-info visually-hidden';
    contactForm.parentNode.insertBefore(formMessages, contactForm.nextSibling);
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            showMessage('Форма отправляется...', 'info');
            setTimeout(() => {
                showMessage('Сообщение успешно отправлено!', 'success');
                contactForm.reset();
            }, 1500);
        }
    });

    function validateField(e) {
        const field = e.target;
        clearFieldError(field);
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Введите корректный email адрес');
                return false;
            }
        }
        if (field.id === 'message' && field.value.length < 10) {
            showFieldError(field, 'Сообщение должно содержать минимум 10 символов');
            return false;
        }
        return true;
    }

    function showFieldError(field, message) {
        field.setAttribute('aria-invalid', 'true');
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger small mt-1';
            errorElement.id = field.id + '-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        field.setAttribute('aria-describedby', errorElement.id);
    }

    function clearFieldError(e) {
        const field = e.target || e;
        field.removeAttribute('aria-invalid');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        field.removeAttribute('aria-describedby');
    }

    function validateForm() {
        let isValid = true;
        inputs.forEach(input => {
            const event = new Event('blur');
            input.dispatchEvent(event);
            if (input.getAttribute('aria-invalid') === 'true') {
                isValid = false;
            }
        });
        return isValid;
    }

    function showMessage(text, type) {
        formMessages.textContent = text;
        formMessages.className = `alert alert-${type} mt-3`;
        formMessages.removeAttribute('aria-hidden');
        formMessages.setAttribute('tabindex', '-1');
        formMessages.focus();
    }
});