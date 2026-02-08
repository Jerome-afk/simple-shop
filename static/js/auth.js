function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`;
}

const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = registerForm.name.value.trim();
        const email = registerForm.email.value.trim();
        const password = registerForm.password.value;

        if (!name || !email || password.length < 6) {
            message.textContent = 'Invalid input.';
            return;
        }

        setCookie('userId', crypto.randomUUID(), 30);
        message.textContent = 'Registration successful!';
    });
}
