// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCFQ_geG0HIv2EZ-bfKc97TJNtf2sdqPzc",
    authDomain: "clack-koder.firebaseapp.com",
    databaseURL: "https://clack-koder-default-rtdb.firebaseio.com",
    projectId: "clack-koder",
    storageBucket: "clack-koder.firebasestorage.app",
    messagingSenderId: "478151254938",
    appId: "1:478151254938:web:e2c00e3a5426bd192b9023",
    measurementId: "G-P29ME5Z3S1"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Estado del juego
const gameState = {
    currentScreen: 'auth',
    isAuthenticated: false,
    currentUser: null,
    user: {
        uid: null,
        name: '',
        email: '',
        age: '',
        level: 1,
        streak: 0,
        gems: 100,
        lives: 5,
        totalCorrect: 0,
        totalQuestions: 0,
        weakAreas: [],
        strengths: [],
        mathPrecision: 0,
        sessionStats: {
            questionsAnswered: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            currentStreak: 0,
            bestStreak: 0
        }
    },
    currentLesson: null,
    currentMode: 'normal',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    timeStart: null,
    calculator: {
        display: '0',
        operation: '',
        steps: []
    }
};

// Base de datos de lecciones
const lessons = [
    {
        id: 'suma',
        title: 'Suma',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Aprende a sumar números',
        levels: 10,
        progress: 0,
        difficulty: 1
    },
    {
        id: 'resta',
        title: 'Resta',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Domina la resta',
        levels: 10,
        progress: 0,
        difficulty: 1
    },
    {
        id: 'multiplicacion',
        title: 'Multiplicación',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Tablas de multiplicar',
        levels: 10,
        progress: 0,
        difficulty: 2
    },
    {
        id: 'division',
        title: 'División',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Divide y vencerás',
        levels: 10,
        progress: 0,
        difficulty: 2
    },
    {
        id: 'fracciones',
        title: 'Fracciones',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Números quebrados',
        levels: 10,
        progress: 0,
        difficulty: 3
    },
    {
        id: 'algebra',
        title: 'Álgebra',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Ecuaciones básicas',
        levels: 10,
        progress: 0,
        difficulty: 4
    },
    {
        id: 'geometria',
        title: 'Geometría',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Formas y figuras',
        levels: 10,
        progress: 0,
        difficulty: 3
    },
    {
        id: 'porcentajes',
        title: 'Porcentajes',
        icon: '<img src="https://images.icon-icons.com/1389/PNG/512/star_96096.png" alt="⭐" style="width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">',
        description: 'Cálculo de porcentajes',
        levels: 10,
        progress: 0,
        difficulty: 3
    }
];



// Estado de personalización de mascota
const mascotCustomization = {
    bodyColor: '#D2691E',
    eyeStyle: 'normal',
    eyeColor: '#000000',
    mouthStyle: 'happy',
    noseStyle: 'normal',
    noseColor: '#2c2c2c',
    background: 'none',
    accessories: {
        hat: false,
        glasses: false,
        bowtie: false,
        scarf: false,
        earrings: false,
        chain: false,
        cap: false,
        headband: false
    },
    patterns: {
        spots: false,
        stripes: false,
        gradient: false
    }
};

// Estado de configuraciones
const appSettings = {
    language: 'es',
    soundEffects: true,
    adaptiveDifficulty: true,
    errorAnalysis: true
};

// Efectos de sonido
const soundEffects = {
    correct: null,
    incorrect: null,
    lessonComplete: null,
    click: new Audio('data:audio/wav;base64,UklGRs4BAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaoBAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA')
};

// Cargar sonidos personalizados
function loadCustomSounds() {
    try {
        soundEffects.correct = new Audio('https://dl.dropboxusercontent.com/scl/fi/l01oa0fzcw8bfcksfcjsy/ElevenLabs_2025-06-16T06_55_25_Sound-Effect.mp3?rlkey=yk4sp07wpvhqn48ndmqer6u01');
        soundEffects.incorrect = new Audio('https://dl.dropboxusercontent.com/scl/fi/696bzht5p7v7v4ucs3gdg/ElevenLabs_2025-06-16T06_57_50_Sound-Effect.mp3?rlkey=kbu35al77j5js5s4fjuzaa66s');
        soundEffects.lessonComplete = new Audio('https://dl.dropboxusercontent.com/scl/fi/y8fm2nyoukg2qapvqahs9/ElevenLabs_2025-06-16T06_59_53_Sound-Effect.mp3?rlkey=0hsh1tblg6larmab82jjekk5j');

        // Precargar los sonidos
        Object.values(soundEffects).forEach(audio => {
            if (audio) {
                audio.preload = 'auto';
                audio.onerror = () => console.log('Error cargando sonido personalizado');
            }
        });
    } catch (error) {
        console.log('Error inicializando sonidos personalizados:', error);
    }
}

// Función para reproducir sonidos
function playSound(soundName) {
    if (appSettings.soundEffects && soundEffects[soundName]) {
        soundEffects[soundName].currentTime = 0;
        soundEffects[soundName].play().catch(e => console.log('Error reproduciendo sonido:', e));
    }
}

// Algoritmo de dificultad adaptativa
function getAdaptiveDifficulty(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    const userAccuracy = gameState.user.totalQuestions > 0 ? 
        gameState.user.totalCorrect / gameState.user.totalQuestions : 0.5;

    let difficulty = lesson.difficulty;

    if (userAccuracy > 0.8) {
        difficulty += 1;
    } else if (userAccuracy < 0.5) {
        difficulty = Math.max(1, difficulty - 1);
    }

    if (gameState.user.weakAreas.includes(lessonId)) {
        difficulty = Math.max(1, difficulty - 1);
    }

    return Math.min(5, Math.max(1, difficulty));
}

// Generador de preguntas
function generateQuestion(lessonId, difficulty) {
    const generators = {
        suma: generateSumaQuestion,
        resta: generateRestaQuestion,
        multiplicacion: generateMultiplicacionQuestion,
        division: generateDivisionQuestion,
        fracciones: generateFraccionesQuestion,
        algebra: generateAlgebraQuestion,
        geometria: generateGeometriaQuestion,
        porcentajes: generatePorcentajesQuestion
    };

    return generators[lessonId](difficulty);
}

function generateSumaQuestion(difficulty) {
    const maxNum = Math.pow(10, difficulty);
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * maxNum) + 1;
    const correct = a + b;

    const answers = [correct];
    while (answers.length < 4) {
        const wrong = correct + Math.floor(Math.random() * 20) - 10;
        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    return {
        question: `¿Cuánto es ${a} + ${b}?`,
        answers: shuffleArray(answers),
        correct: correct,
        explanation: `${a} + ${b} = ${correct}`,
        steps: [`Sumamos ${a} + ${b}`, `Resultado: ${correct}`]
    };
}

function generateRestaQuestion(difficulty) {
    const maxNum = Math.pow(10, difficulty);
    const a = Math.floor(Math.random() * maxNum) + 10;
    const b = Math.floor(Math.random() * (a - 1)) + 1;
    const correct = a - b;

    const answers = [correct];
    while (answers.length < 4) {
        const wrong = correct + Math.floor(Math.random() * 20) - 10;
        if (wrong >= 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    return {
        question: `¿Cuánto es ${a} - ${b}?`,
        answers: shuffleArray(answers),
        correct: correct,
        explanation: `${a} - ${b} = ${correct}`,
        steps: [`Restamos ${b} de ${a}`, `Resultado: ${correct}`]
    };
}

function generateMultiplicacionQuestion(difficulty) {
    const maxNum = Math.min(12, difficulty * 3);
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * maxNum) + 1;
    const correct = a * b;

    const answers = [correct];
    while (answers.length < 4) {
        const wrong = correct + Math.floor(Math.random() * 30) - 15;
        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    return {
        question: `¿Cuánto es ${a} × ${b}?`,
        answers: shuffleArray(answers),
        correct: correct,
        explanation: `${a} × ${b} = ${correct}`,
        steps: [`Multiplicamos ${a} por ${b}`, `Resultado: ${correct}`]
    };
}

function generateDivisionQuestion(difficulty) {
    const divisor = Math.floor(Math.random() * 10) + 2;
    const quotient = Math.floor(Math.random() * difficulty * 10) + 1;
    const dividend = divisor * quotient;

    const answers = [quotient];
    while (answers.length < 4) {
        const wrong = quotient + Math.floor(Math.random() * 10) - 5;
        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    return {
        question: `¿Cuánto es ${dividend} ÷ ${divisor}?`,
        answers: shuffleArray(answers),
        correct: quotient,
        explanation: `${dividend} ÷ ${divisor} = ${quotient}`,
        steps: [`Dividimos ${dividend} entre ${divisor}`, `Resultado: ${quotient}`]
    };
}

function generateFraccionesQuestion(difficulty) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const den1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const den2 = den1;

    const resultNum = num1 + num2;
    const correct = `${resultNum}/${den1}`;

    return {
        question: `¿Cuánto es ${num1}/${den1} + ${num2}/${den2}?`,
        answers: shuffleArray([correct, `${resultNum+1}/${den1}`, `${resultNum-1}/${den1}`, `${resultNum}/${den1+1}`]),
        correct: correct,
        explanation: `${num1}/${den1} + ${num2}/${den2} = ${correct}`,
        steps: [`Sumamos numeradores: ${num1} + ${num2} = ${resultNum}`, `Mantenemos denominador: ${den1}`, `Resultado: ${correct}`]
    };
}

function generateAlgebraQuestion(difficulty) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const x = Math.floor(Math.random() * 10) + 1;
    const result = a * x + b;

    const answers = [x];
    while (answers.length < 4) {
        const wrong = x + Math.floor(Math.random() * 10) - 5;
        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    return {
        question: `Si ${a}x + ${b} = ${result}, ¿cuál es el valor de x?`,
        answers: shuffleArray(answers),
        correct: x,
        explanation: `x = ${x}`,
        steps: [`${a}x + ${b} = ${result}`, `${a}x = ${result} - ${b}`, `${a}x = ${result - b}`, `x = ${(result - b) / a}`, `x = ${x}`]
    };
}

function generateGeometriaQuestion(difficulty) {
    const lado = Math.floor(Math.random() * 10) + 1;
    const area = lado * lado;

    const answers = [area];
    while (answers.length < 4) {
        const wrong = area + Math.floor(Math.random() * 20) - 10;
        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    return {
        question: `¿Cuál es el área de un cuadrado con lado de ${lado} unidades?`,
        answers: shuffleArray(answers),
        correct: area,
        explanation: `Área = lado × lado = ${lado} × ${lado} = ${area}`,
        steps: [`Fórmula: Área = lado²`, `Área = ${lado}²`, `Área = ${area} unidades²`]
    };
}

function generatePorcentajesQuestion(difficulty) {
    const total = Math.floor(Math.random() * 100) + 50;
    const percentage = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
    const correct = Math.floor(total * percentage / 100);

    const answers = [correct];
    while (answers.length < 4) {
        const wrong = correct + Math.floor(Math.random() * 20) - 10;
        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    return {
        question: `¿Cuánto es el ${percentage}% de ${total}?`,
        answers: shuffleArray(answers),
        correct: correct,
        explanation: `${percentage}% de ${total} = ${correct}`,
        steps: [`${percentage}% = ${percentage}/100`, `${total} × ${percentage}/100 = ${correct}`]
    };
}

// Funciones de autenticación
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
        document.querySelector('.auth-tab').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

async function registerUser() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const age = document.getElementById('userAge').value;

    if (!name || !email || !password || !age) {
        return;
    }

    if (password !== confirmPassword) {
        return;
    }

    if (password.length < 6) {
        return;
    }

    const registerButton = event.target;
    const originalText = registerButton.innerHTML;

    try {
        registerButton.disabled = true;
        registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
        updateMascotMessage('Creando tu cuenta...');

        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await database.ref('users/' + user.uid).set({
            name: name,
            email: email,
            age: age,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            level: 1,
            streak: 0,
            gems: 100,
            lives: 5,
            totalCorrect: 0,
            totalQuestions: 0,
            weakAreas: [],
            strengths: [],
            mascotCustomization: {
                bodyColor: '#D2691E',
                eyeStyle: 'normal',
                mouthStyle: 'happy',
                accessories: {
                    hat: false,
                    glasses: false,
                    bowtie: false,
                    scarf: false
                }
            },
            settings: {
                language: 'es',
                soundEffects: true,
                backgroundMusic: false,
                volume: 50,
                adaptiveDifficulty: true,
                dailyReminders: false,
                vibration: false,
                shareProgress: false,
                errorAnalysis: true
            }
        });

        updateMascotMessage(`¡Cuenta creada exitosamente! Bienvenido ${name}! 🎉`);

        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('userAge').value = '';

    } catch (error) {
        console.error('Error en registro:', error);

        let errorMessage = 'Error al crear la cuenta.';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'El correo electrónico no es válido.';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
                break;
            default:
                errorMessage = 'Error al crear la cuenta. Intenta de nuevo.';
        }

        updateMascotMessage(errorMessage);
    } finally {
        registerButton.disabled = false;
        registerButton.innerHTML = originalText;
    }
}

async function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        updateMascotMessage('Por favor completa todos los campos para iniciar sesión.');
        return;
    }

    const loginButton = event.target;
    const originalText = loginButton.innerHTML;

    try {
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        updateMascotMessage('Iniciando sesión...');

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        updateMascotMessage('¡Sesión iniciada correctamente!');

        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';

    } catch (error) {
        console.error('Error en login:', error);

        let errorMessage = 'Error al iniciar sesión.';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No existe una cuenta con este correo. ¿Quieres registrarte?';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Contraseña incorrecta. Verifica e intenta de nuevo.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'El correo electrónico no es válido.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Esta cuenta ha sido deshabilitada.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos fallidos. Espera un momento e intenta de nuevo.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
                break;
            default:
                errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
        }

        updateMascotMessage(errorMessage);
    } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = originalText;
    }
}

async function loginWithGoogle() {
    updateMascotMessage('Lo siento, el inicio de sesión con Google no está disponible en este momento. Por favor usa el registro manual con email y contraseña.');
    return;
}

async function logoutUser() {
    try {
        await auth.signOut();
        showAuthScreen();
        updateMascotMessage('¡Hasta luego! Te esperaré para otra aventura matemática 👋');
    } catch (error) {
        console.error('Error en logout:', error);
    }
}

let hasShownWelcomeMessage = false;

auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            gameState.isAuthenticated = true;
            gameState.currentUser = user;

            const userRef = database.ref('users/' + user.uid);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val();

            if (userData) {
                gameState.user = {
                    uid: user.uid,
                    name: userData.name,
                    email: userData.email,
                    age: userData.age,
                    level: userData.level || 1,
                    streak: userData.streak || 0,
                    gems: userData.gems || 100,
                    lives: userData.lives || 5,
                    totalCorrect: userData.totalCorrect || 0,
                    totalQuestions: userData.totalQuestions || 0,
                    weakAreas: userData.weakAreas || [],
                    strengths: userData.strengths || []
                };

                if (userData.mascotCustomization) {
                    Object.assign(mascotCustomization, userData.mascotCustomization);
                }
                if (userData.settings) {
                    Object.assign(appSettings, userData.settings);
                }
            } else {
                gameState.user = {
                    uid: user.uid,
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    age: 'adult',
                    level: 1,
                    streak: 0,
                    gems: 100,
                    lives: 5,
                    totalCorrect: 0,
                    totalQuestions: 0,
                    weakAreas: [],
                    strengths: []
                };
            }

            showHome();

            if (!hasShownWelcomeMessage) {
                setTimeout(() => {
                    updateMascotMessage(`¡Hola ${gameState.user.name}! Soy BeMaa, tu compañero de aprendizaje matemático. ¿Listo para empezar?`);
                    hasShownWelcomeMessage = true;
                }, 1000);
            }

        } catch (error) {
            console.error('Error en autenticación:', error);
            gameState.isAuthenticated = false;
            gameState.currentUser = null;
            updateMascotMessage('Error al iniciar sesión. Por favor intenta de nuevo.');
        }

    } else {
        gameState.isAuthenticated = false;
        gameState.currentUser = null;
        hasShownWelcomeMessage = false;
        showAuthScreen();
    }
});

// Funciones de navegación
function showAuthScreen() {
    hideAllScreens();
    document.getElementById('authScreen').classList.add('active');
    gameState.currentScreen = 'auth';
}

function showHome() {
    if (!gameState.isAuthenticated) {
        showAuthScreen();
        return;
    }

    // Limpiar cualquier estado de personalización activo
    const customizationScreen = document.getElementById('mascotCustomizationScreen');
    if (customizationScreen) {
        customizationScreen.classList.remove('active');
    }

    hideAllScreens();
    document.getElementById('homeScreen').classList.add('active');
    gameState.currentScreen = 'home';
    updateUserStats();
    updateNavigation('home');
    renderLessons(); // Renderizar lecciones en la pantalla principal

    // La mascota ahora solo aparece dentro de las lecciones
}

function showLessons() {
    // Las lecciones ahora están integradas en la pantalla principal
    showHome();
}

function showProfile() {
    if (!gameState.isAuthenticated) {
        showAuthScreen();
        return;
    }

    hideAllScreens();
    document.getElementById('profileScreen').classList.add('active');
    gameState.currentScreen = 'profile';
    updateNavigation('profile');
    updateProfileData();
    updateMascotMessage('¡Este es tu perfil! Aquí puedes ver tu progreso y personalizar tu mascota.');
}

function showMascotCustomization() {
    // Solo permitir acceso desde el perfil
    if (gameState.currentScreen !== 'profile') {
        updateMascotMessage('Para personalizar tu avatar, ve primero a tu perfil.');
        return;
    }

    hideAllScreens();
    const customizationScreen = document.getElementById('mascotCustomizationScreen');
    if (customizationScreen) {
        customizationScreen.classList.add('active');
        customizationScreen.style.display = 'block';
    }
    gameState.currentScreen = 'mascotCustomization';

    loadMascotCustomization();

    setTimeout(() => {
        applyMascotCustomization('preview');
        initializeDragFunctionality();
    }, 150);

    updateMascotMessage('Hagamos que tu avatar sea único. Puedes cambiar colores, ojos, boca y más.');
}

function showSettings() {
    hideAllScreens();
    document.getElementById('settingsScreen').classList.add('active');
    gameState.currentScreen = 'settings';
    updateNavigation('settings');
    loadSettings();
    updateMascotMessage('Aquí puedes ajustar la aplicación a tu gusto.');
}

function showLeaderboard() {
    updateMascotMessage('¡Pronto podrás competir con otros estudiantes en el ranking!');
}

function updateNavigation(activeScreen) {
    // Actualizar estado activo de la navegación inferior
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Mapear pantallas a elementos de navegación
    const navMap = {
        'home': 0,
        'leaderboard': 1,
        'profile': 2,
        'settings': 3
    };

    const navItems = document.querySelectorAll('.nav-item');
    if (navMap[activeScreen] !== undefined && navItems[navMap[activeScreen]]) {
        navItems[navMap[activeScreen]].classList.add('active');
    }
}

function showStats() {
    updateMascotMessage('Estas son tus estadísticas. ¡Sigue así!');
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Renderizado de lecciones
function renderLessons() {
    const grid = document.getElementById('lessonsGrid');
    grid.innerHTML = '';

    lessons.forEach((lesson, index) => {
        let nodeState = 'locked';
        if (index === 0 || lessons[index - 1].progress >= 50) {
            nodeState = 'available';
        }
        if (lesson.progress > 0 && lesson.progress < 70) {
            nodeState = 'current';
        }
        if (lesson.progress >= 70 && lesson.progress < 100) {
            nodeState = 'completed';
        }
        if (lesson.progress === 100) {
            nodeState = 'perfect';
        }

        let specialType = '';
        if (index === 3 || index === 7) {
            specialType = 'checkpoint';
        } else if (index === lessons.length - 1) {
            specialType = 'boss';
        }

        const nodeElement = document.createElement('div');
        nodeElement.className = `lesson-node ${nodeState} ${specialType}`;
        nodeElement.onclick = () => selectLesson(lesson.id);

        nodeElement.style.animationDelay = `${index * 0.1}s`;

        nodeElement.innerHTML = `
            <div class="lesson-icon">${lesson.icon}</div>
        `;

        grid.appendChild(nodeElement);
    });
}

function selectLesson(lessonId) {
    playSound('click');
    const lesson = lessons.find(l => l.id === lessonId);
    const lessonIndex = lessons.findIndex(l => l.id === lessonId);

    if (lessonIndex > 0 && lessons[lessonIndex - 1].progress < 50) {
        updateMascotMessage('¡Oops! Primero debes completar la lección anterior para desbloquear esta.');
        return;
    }

    gameState.currentLesson = lessonId;
    showLessonModal(lesson);
}

function showLessonModal(lesson) {
    const modalHtml = `
        <div class="lesson-modal-overlay" id="lessonModal" onclick="closeLessonModal()">
            <div class="lesson-modal-content" onclick="event.stopPropagation()">
                <div class="lesson-modal-header">
                    <h2>${lesson.title}</h2>
                    <button class="close-btn" onclick="closeLessonModal()">×</button>
                </div>
                <div class="lesson-modal-body">
                    <div class="lesson-big-icon">${lesson.icon}</div>
                    <p class="lesson-description">${lesson.description}</p>
                    <div class="lesson-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${lesson.progress}%"></div>
                        </div>
                        <span class="progress-text">${lesson.progress}% completado</span>
                    </div>
                </div>
                <div class="lesson-modal-actions">
                    <button class="start-lesson-btn" onclick="startLessonFromModal()">
                        <i class="fas fa-play"></i>
                        Comenzar Lección
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    if (lesson.progress === 0) {
        updateMascotMessage(`¡Nueva aventura! Vamos a explorar ${lesson.title} juntos.`);
    } else if (lesson.progress < 100) {
        updateMascotMessage(`¡Continuemos con ${lesson.title}! Ya tienes ${lesson.progress}% completado.`);
    } else {
        updateMascotMessage(`¡Perfecto! Repasemos ${lesson.title} para mantenerte afilado.`);
    }
}

function closeLessonModal() {
    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.remove();
    }
}

function startLessonFromModal() {
    closeLessonModal();
    gameState.currentMode = 'normal';
    startGame();
}

function startMode(mode) {
    if (!gameState.currentLesson) {
        updateMascotMessage('¡Primero selecciona una lección!');
        return;
    }

    gameState.currentMode = mode;
    startGame();
}

// Lógica del juego
function startGame() {
    hideAllScreens();
    document.getElementById('gameScreen').classList.add('active');
    gameState.currentScreen = 'game';

    const difficulty = getAdaptiveDifficulty(gameState.currentLesson);
    gameState.questions = [];

    const questionCount = gameState.currentMode === 'challenge' ? 20 : 10;

    for (let i = 0; i < questionCount; i++) {
        const question = generateQuestion(gameState.currentLesson, difficulty);
        question.topic = gameState.currentLesson;
        gameState.questions.push(question);
    }

    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.timeStart = Date.now();

    const lessonName = lessons.find(l => l.id === gameState.currentLesson)?.title || 'matemáticas';
    updateMascotMessage(`¡Perfecto! Vamos a practicar ${lessonName}. Lee bien cada pregunta y piensa antes de responder.`);

    setTimeout(showQuestion, 2000);
}

function showQuestion() {
    if (!gameState.questions || gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame();
        return;
    }

    const question = gameState.questions[gameState.currentQuestionIndex];

    // Actualizar números de pregunta
    const questionNumElement = document.getElementById('questionNum');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const questionTextElement = document.getElementById('questionText');
    const progressFillElement = document.getElementById('progressFill');
    const livesCountElement = document.getElementById('livesCount');

    if (questionNumElement) questionNumElement.textContent = gameState.currentQuestionIndex + 1;
    if (totalQuestionsElement) totalQuestionsElement.textContent = gameState.questions.length;
    if (questionTextElement) questionTextElement.textContent = question.question;

    // Actualizar barra de progreso
    const progress = ((gameState.currentQuestionIndex) / gameState.questions.length) * 100;
    if (progressFillElement) progressFillElement.style.width = progress + '%';

    // Limpiar y crear botones de respuesta
    const container = document.getElementById('answersContainer');
    if (container) {
        container.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.style.animationDelay = `${index * 0.1}s`;
            button.onclick = () => {
                // Evitar múltiples clics
                if (button.disabled) return;
                
                playSound('click');
                selectAnswer(answer);
            };
            container.appendChild(button);
        });
    }

    // Actualizar vidas
    if (livesCountElement) livesCountElement.textContent = gameState.user.lives;
}

function selectAnswer(selectedAnswer) {
    const question = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = selectedAnswer == question.correct;

    // Actualizar estadísticas en tiempo real
    gameState.user.totalQuestions++;
    gameState.user.sessionStats.questionsAnswered++;
    
    if (isCorrect) {
        gameState.user.totalCorrect++;
        gameState.user.sessionStats.correctAnswers++;
        gameState.user.sessionStats.currentStreak++;
        gameState.score += 10;
        
        if (gameState.user.sessionStats.currentStreak > gameState.user.sessionStats.bestStreak) {
            gameState.user.sessionStats.bestStreak = gameState.user.sessionStats.currentStreak;
        }
    } else {
        gameState.user.sessionStats.wrongAnswers++;
        gameState.user.sessionStats.currentStreak = 0;
        gameState.user.lives--;
    }

    // Calcular precisión matemática en tiempo real
    gameState.user.mathPrecision = Math.round((gameState.user.totalCorrect / gameState.user.totalQuestions) * 100);
    
    // Actualizar UI en tiempo real
    updateRealTimeStats();

    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        if (btn.textContent == question.correct) {
            btn.classList.add('correct');
        } else if (btn.textContent == selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    if (isCorrect) {
        playSound('correct');
        updateMascotMessage('¡Correcto! Tu precisión matemática está mejorando.');
    } else {
        playSound('incorrect');
        updateMascotMessage('No te preocupes, cada error es una oportunidad de aprender.');

        if (gameState.currentMode === 'survival' && gameState.user.lives <= 0) {
            setTimeout(() => {
                endGame();
            }, 2000);
            return;
        }
    }

    setTimeout(() => {
        nextQuestion();
    }, 2500);
}

function nextQuestion() {
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        setTimeout(() => {
            endGame();
        }, 500);
    } else {
        // Limpiar respuestas anteriores
        const container = document.getElementById('answersContainer');
        if (container) {
            container.innerHTML = '';
        }
        
        // Mostrar la siguiente pregunta
        setTimeout(() => {
            showQuestion();
        }, 300);
    }
}

function endGame() {
    hideAllScreens();
    document.getElementById('resultsScreen').classList.add('active');

    const totalTime = (Date.now() - gameState.timeStart) / 1000;
    const accuracy = gameState.user.totalCorrect / gameState.user.totalQuestions;
    const rewards = calculateRewards(gameState.score, accuracy, totalTime, gameState.currentMode);

    const currentLesson = lessons.find(l => l.id === gameState.currentLesson);
    if (currentLesson) {
        const progressIncrease = Math.round(accuracy * 20);
        currentLesson.progress = Math.min(100, currentLesson.progress + progressIncrease);

        localStorage.setItem('lessonsProgress', JSON.stringify(lessons.map(l => ({id: l.id, progress: l.progress}))));
    }

    gameState.user.gems += rewards.gems;

    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('accuracy').textContent = Math.round(accuracy * 100) + '%';
    document.getElementById('gemsEarned').textContent = rewards.gems;

    if (accuracy >= 0.8) {
        gameState.user.streak++;
    } else {
        gameState.user.streak = 0;
    }

    const achievements = document.getElementById('achievements');
    achievements.innerHTML = '';

    if (accuracy === 1.0) {
        addAchievement('¡Perfecto! 🏆');
    }
    if (gameState.user.streak >= 3) {
        addAchievement('¡Racha de fuego! 🔥');
    }
    if (rewards.gems >= 50) {
        addAchievement('¡Rico en gemas! 💎');
    }
    if (currentLesson && currentLesson.progress === 100) {
        addAchievement('¡Lección completada! 🎯');
        playSound('lessonComplete'); // Play the lesson complete sound
    }

    updateUserStats();

    if (accuracy >= 0.8) {
        updateMascotMessage('¡Increíble trabajo! Estoy muy orgulloso 🎊');
    } else {
        updateMascotMessage('¡Buen intento! La práctica hace al maestro 📚');
    }
}

function addAchievement(text) {
    const achievements = document.getElementById('achievements');
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.textContent = text;
    achievements.appendChild(achievement);
}

function calculateRewards(score, accuracy, time, mode) {
    let gems = Math.floor(score / 10);
    let experience = score;

    if (accuracy >= 0.9) gems += 10;
    if (accuracy === 1.0) gems += 20;
    if (time < 60) gems += 5;

    const multipliers = {
        normal: 1,
        challenge: 1.5,
        survival: 2
    };

    gems = Math.floor(gems * multipliers[mode]);
    experience = Math.floor(experience * multipliers[mode]);

    return { gems, experience };
}

// Calculadora virtual
function showCalculator() {
    document.getElementById('calculatorModal').style.display = 'block';
    gameState.calculator.display = '0';
    gameState.calculator.operation = '';
    gameState.calculator.steps = [];
    updateCalculatorDisplay();
}

function closeCalculator() {
    document.getElementById('calculatorModal').style.display = 'none';
}

function calcNumber(num) {
    if (gameState.calculator.display === '0') {
        gameState.calculator.display = num.toString();
    } else {
        gameState.calculator.display += num.toString();
    }
    updateCalculatorDisplay();
}

function calcOperation(op) {
    if (gameState.calculator.operation) {
        calcEquals();
    }
    gameState.calculator.operation = gameState.calculator.display + ' ' + op + ' ';
    addCalculatorStep(`Operación: ${gameState.calculator.operation}`);
    gameState.calculator.display = '0';
    updateCalculatorDisplay();
}

function calcEquals() {
    if (gameState.calculator.operation) {
        const expression = gameState.calculator.operation + gameState.calculator.display;
        addCalculatorStep(`Calculando: ${expression}`);

        try {
            const result = eval(expression.replace('×', '*').replace('÷', '/'));
            gameState.calculator.display = result.toString();
            addCalculatorStep(`Resultado: ${result}`);
            gameState.calculator.operation = '';
        } catch (e) {
            gameState.calculator.display = 'Error';
        }
    }
    updateCalculatorDisplay();
}

function calcDecimal() {
    if (!gameState.calculator.display.includes('.')) {
        gameState.calculator.display += '.';
        updateCalculatorDisplay();
    }
}

function calcDelete() {
    if (gameState.calculator.display.length > 1) {
        gameState.calculator.display = gameState.calculator.display.slice(0, -1);
    } else {
        gameState.calculator.display = '0';
    }
    updateCalculatorDisplay();
}

function clearCalc() {
    gameState.calculator.display = '0';
    gameState.calculator.operation = '';
    gameState.calculator.steps = [];
    updateCalculatorDisplay();
    updateCalculatorSteps();
}

function updateCalculatorDisplay() {
    document.getElementById('calcDisplay').textContent = gameState.calculator.display;
}

function addCalculatorStep(step) {
    gameState.calculator.steps.push(step);
    updateCalculatorSteps();
}

function updateCalculatorSteps() {
    const stepsList = document.getElementById('stepsList');
    stepsList.innerHTML = '';
    gameState.calculator.steps.forEach(step => {
        const div = document.createElement('div');
        div.textContent = step;
        div.style.padding = '5px 0';
        stepsList.appendChild(div);
    });
}

function showHint() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    updateMascotMessage(`💡 Pista: ${question.steps[0]}`);
}

function showExplanation() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    let explanation = question.explanation + '\n\nPasos:\n';
    question.steps.forEach((step, index) => {
        explanation += `${index + 1}. ${step}\n`;
    });
    updateMascotMessage(explanation);
}

// Funciones de personalización
function initializeDragFunctionality() {
    const customizationControls = document.querySelector('.customization-controls');
    const dragHandle = document.querySelector('.drag-handle');

    if (!customizationControls || !dragHandle) return;

    let isDragging = false;
    let startY = 0;
    let currentTransform = 0;

    function startDrag(e) {
        isDragging = true;
        startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        dragHandle.style.cursor = 'grabbing';
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;

        const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const deltaY = currentY - startY;

        const maxUp = -window.innerHeight * 0.2;
        const maxDown = window.innerHeight * 0.1;

        currentTransform = Math.min(maxDown, Math.max(maxUp, deltaY));

        customizationControls.style.transform = `translateY(${currentTransform}px)`;
        e.preventDefault();
    }

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;
        dragHandle.style.cursor = 'grab';

        if (currentTransform > window.innerHeight * 0.05) {
            customizationControls.style.transform = 'translateY(calc(55vh - 80px))';
            customizationControls.style.height = '80px';
        } else if (currentTransform < -window.innerHeight * 0.1) {
            customizationControls.style.transform = 'translateY(-10vh)';
            customizationControls.style.height = '75vh';
        } else {
            customizationControls.style.transform = 'translateY(0)';
            customizationControls.style.height = '55vh';
        }

        currentTransform = 0;
    }

    dragHandle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    dragHandle.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-modern').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.customization-panel-modern').forEach(panel => {
        panel.classList.remove('active');
    });

    event.target.classList.add('active');

    const panelMap = {
        'pelaje': 'pelajePanel',
        'ojos': 'ojosPanel',
        'boca': 'bocaPanel',
        'nariz': 'narizPanel',
        'accesorios': 'accesoriosPanel',
        'fondos': 'fondosPanel'
    };

    const panelId = panelMap[tabName];
    if (panelId) {
        document.getElementById(panelId).classList.add('active');
    }
}

function changeBackground(backgroundType) {
    mascotCustomization.background = backgroundType;

    const previewSection = document.querySelector('.mascot-preview-section');

    if (previewSection) {
        switch(backgroundType) {
            case 'forest':
                previewSection.style.background = 'linear-gradient(135deg, #2d5016 0%, #3e7b20 100%)';
                break;
            case 'ocean':
                previewSection.style.background = 'linear-gradient(135deg, #006994 0%, #0077be 100%)';
                break;
            case 'desert':
                previewSection.style.background = 'linear-gradient(135deg, #daa520 0%, #f4a460 100%)';
                break;
            case 'mountain':
                previewSection.style.background = 'linear-gradient(135deg, #708090 0%, #a9a9a9 100%)';
                break;
            case 'space':
                previewSection.style.background = 'linear-gradient(135deg, #191970 0%, #4b0082 100%)';
                break;
            case 'sunset':
                previewSection.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)';
                break;
            case 'winter':
                previewSection.style.background = 'linear-gradient(135deg, #b0e0e6 0%, #ffffff 100%)';
                break;
            default:
                previewSection.style.background = 'linear-gradient(135deg, #58cc02 0%, #89e219 100%)';
                break;
        }
    }

    document.querySelectorAll('#fondosPanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');

    const messages = {
        'none': 'El fondo clasico me encanta',
        'forest': 'Me siento como en casa en el bosque',
        'ocean': 'El oceano es tan relajante',
        'desert': 'Que aventura en el desierto',
        'mountain': 'Las montanas son majestuosas',
        'space': 'Explorando el universo',
        'sunset': 'Que hermoso atardecer',
        'winter': 'Me encanta la nieve'
    };

    updateMascotMessage(messages[backgroundType] || 'Nuevo fondo genial');
}

function changeBodyColor(color) {
    mascotCustomization.bodyColor = color;
    applyMascotCustomization('preview');

    document.querySelectorAll('#pelajePanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');

    updateMascotMessage('Me gusta este color, se ve genial');
}

function changeEyeStyle(style) {
    mascotCustomization.eyeStyle = style;
    applyMascotCustomization('preview');

    document.querySelectorAll('#ojosPanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');

    const messages = {
        'normal': 'Unos ojos clasicos',
        'large': 'Que ojos tan grandes y expresivos',
        'sleepy': 'Parezco tener sueno',
        'happy': 'Me veo muy feliz asi',
        'star': 'Tengo estrellas en los ojos',
        'heart': 'Ojos llenos de amor',
        'rainbow': 'Que colorido me veo',
        'cool': 'Me veo super genial'
    };

    updateMascotMessage(messages[style] || 'Me encanta este estilo');
}

function changeMouthStyle(style) {
    mascotCustomization.mouthStyle = style;
    applyMascotCustomization('preview');

    document.querySelectorAll('#bocaPanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');

    const messages = {
        'happy': 'Una sonrisa hermosa',
        'neutral': 'Expresion serena y calmada',
        'surprised': 'Que sorpresa tan grande',
        'playful': 'Me siento jugueton',
        'laugh': 'Me da mucha risa',
        'cute': 'Que adorable me veo'
    };

    updateMascotMessage(messages[style] || 'Me gusta esta expresion');
}

function changeNoseStyle(style) {
    mascotCustomization.noseStyle = style;
    applyMascotCustomization('preview');

    document.querySelectorAll('#narizPanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');

    const messages = {
        'normal': 'Una nariz perfecta',
        'small': 'Que tierna naricita',
        'big': 'Una nariz prominente y distinguida',
        'button': 'Como un botoncito',
        'heart': 'Una nariz llena de amor'
    };

    updateMascotMessage(messages[style] || 'Esta nariz me queda genial');
}

function toggleAccessory(accessory) {
    mascotCustomization.accessories[accessory] = !mascotCustomization.accessories[accessory];
    applyMascotCustomization('preview');

    const button = event.target.closest('.option-card');
    button.classList.toggle('selected');

    const messages = {
        'hat': mascotCustomization.accessories[accessory] ? 'Un sombrero elegante' : 'Sin sombrero, mas natural',
        'glasses': mascotCustomization.accessories[accessory] ? 'Me veo muy intelectual' : 'Sin lentes, ojos al natural',
        'cap': mascotCustomization.accessories[accessory] ? 'Lista para el deporte' : 'Sin gorra, estilo casual',
        'headband': mascotCustomization.accessories[accessory] ? 'Como toda una princesa' : 'Sin diadema, estilo simple',
        'earrings': mascotCustomization.accessories[accessory] ? 'Brillando con estilo' : 'Sin aretes, look natural',
        'bowtie': mascotCustomization.accessories[accessory] ? 'Muy elegante y formal' : 'Sin corbatin, mas relajado',
        'chain': mascotCustomization.accessories[accessory] ? 'Estilo brillante' : 'Sin cadena, estilo minimalista',
        'scarf': mascotCustomization.accessories[accessory] ? 'Abrigadito y fashionable' : 'Sin bufanda, mas fresco'
    };

    updateMascotMessage(messages[accessory] || 'Cambio de look');
}

function resetCustomization() {
    mascotCustomization.bodyColor = '#D2691E';
    mascotCustomization.eyeStyle = 'normal';
    mascotCustomization.mouthStyle = 'happy';
    mascotCustomization.noseStyle = 'normal';
    mascotCustomization.background = 'none';

    Object.keys(mascotCustomization.accessories).forEach(accessory => {
        mascotCustomization.accessories[accessory] = false;
    });

    const previewSection = document.querySelector('.mascot-preview-section');
    if (previewSection) {
        previewSection.style.background = 'linear-gradient(135deg, #58cc02 0%, #89e219 100%)';
    }

    applyMascotCustomization('preview');

    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });

    document.querySelector('[data-color="#D2691E"]')?.classList.add('selected');

    updateMascotMessage('He vuelto a mi aspecto original');
}

function loadMascotCustomization() {
    if (gameState.user && gameState.user.mascotCustomization) {
        Object.assign(mascotCustomization, gameState.user.mascotCustomization);
    }

    if (mascotCustomization.background && mascotCustomization.background !== 'none') {
        const backgroundMap = {
            'forest': 'linear-gradient(135deg, #2d5016 0%, #3e7b20 100%)',
            'ocean': 'linear-gradient(135deg, #006994 0%, #0077be 100%)',
            'desert': 'linear-gradient(135deg, #daa520 0%, #f4a460 100%)',
            'mountain': 'linear-gradient(135deg, #708090 0%, #a9a9a9 100%)',
            'space': 'linear-gradient(135deg, #191970 0%, #4b0082 100%)',
            'sunset': 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
            'winter': 'linear-gradient(135deg, #b0e0e6 0%, #ffffff 100%)'
        };

        const previewSection = document.querySelector('.mascot-preview-section');
        if (previewSection && backgroundMap[mascotCustomization.background]) {
            previewSection.style.background = backgroundMap[mascotCustomization.background];
        }
    }

    applyMascotCustomization('preview');

    setTimeout(() => {
        document.querySelectorAll('.option-card').forEach(card => {
            const colorAttr = card.getAttribute('data-color');
            if (colorAttr === mascotCustomization.bodyColor) {
                card.classList.add('selected');
            }
        });

        Object.keys(mascotCustomization.accessories).forEach(accessory => {
            if (mascotCustomization.accessories[accessory]) {
                const accessoryCard = document.querySelector(`[onclick="toggleAccessory('${accessory}')"]`);
                if (accessoryCard) {
                    accessoryCard.classList.add('selected');
                }
            }
        });

        if (mascotCustomization.background) {
            const backgroundCard = document.querySelector(`[onclick="changeBackground('${mascotCustomization.background}')"]`);
            if (backgroundCard) {
                backgroundCard.classList.add('selected');
            }
        }
    }, 100);
}

function applyMascotCustomization(target = 'main') {
    const prefixes = ['preview'];

    prefixes.forEach(prefix => {
        const head = document.getElementById(`${prefix}BearHead`);
        const body = document.getElementById(`${prefix}BearBody`);
        const ears = document.querySelectorAll(`#${prefix}BearEarLeft, #${prefix}BearEarRight`);

        if (head) {
            head.style.background = `linear-gradient(145deg, ${mascotCustomization.bodyColor} 0%, ${darkenColor(mascotCustomization.bodyColor, 20)} 50%, ${darkenColor(mascotCustomization.bodyColor, 40)} 100%)`;
        }
        if (body) {
            body.style.background = `linear-gradient(145deg, ${mascotCustomization.bodyColor} 0%, ${darkenColor(mascotCustomization.bodyColor, 20)} 50%, ${darkenColor(mascotCustomization.bodyColor, 40)} 100%)`;
        }
        ears.forEach(ear => {
            if (ear) ear.style.background = `linear-gradient(145deg, ${mascotCustomization.bodyColor} 0%, ${darkenColor(mascotCustomization.bodyColor, 30)} 70%)`;
        });

        const eyes = document.querySelectorAll(`#${prefix}BearEyeLeft, #${prefix}BearEyeRight`);
        eyes.forEach((eye, index) => {
            if (!eye) return;

            eye.style.transform = 'scale(1)';
            eye.style.height = '28px';
            eye.style.width = '28px';
            eye.style.borderRadius = '50%';
            eye.innerHTML = '';

            const pupil = eye.querySelector('.pupil') || document.createElement('div');
            pupil.className = 'pupil';

            switch (mascotCustomization.eyeStyle) {
                case 'large':
                    eye.style.transform = 'scale(1.4)';
                    pupil.style.background = `radial-gradient(circle at 30% 30%, ${mascotCustomization.eyeColor} 0%, #000 100%)`;
                    break;
                case 'sleepy':
                    eye.style.height = '12px';
                    eye.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
                    pupil.style.background = `${mascotCustomization.eyeColor}`;
                    break;
                case 'happy':
                    eye.style.borderRadius = '50% 50% 50% 50% / 100% 100% 0% 0%';
                    eye.style.height = '20px';
                    pupil.style.background = `radial-gradient(circle at 30% 30%, ${mascotCustomization.eyeColor} 0%, #000 100%)`;
                    break;
                case 'star':
                    eye.innerHTML = `<div style="color: ${mascotCustomization.eyeColor}; font-size: 20px;">⭐</div>`;
                    eye.style.display = 'flex';
                    eye.style.alignItems = 'center';
                    eye.style.justifyContent = 'center';
                    eye.style.background = 'radial-gradient(circle, #ffffff 0%, #f0f0f0 100%)';
                    break;
                case 'rainbow':
                    eye.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
                    pupil.style.background = '#fff';
                    pupil.style.boxShadow = '0 0 10px #00d4ff';
                    break;
                case 'heart':
                    eye.innerHTML = `<div style="color: ${mascotCustomization.eyeColor}; font-size: 18px;">💖</div>`;
                    eye.style.display = 'flex';
                    eye.style.alignItems = 'center';
                    eye.style.justifyContent = 'center';
                    eye.style.background = 'radial-gradient(circle, #ffffff 0%, #ffe0e6 100%)';
                    break;
                case 'cool':
                    eye.style.background = 'linear-gradient(45deg, #1e3c72, #2a5298)';
                    pupil.style.background = '#00d4ff';
                    pupil.style.boxShadow = '0 0 10px #00d4ff';
                    break;
                default:
                    pupil.style.background = `radial-gradient(circle at 30% 30%, ${mascotCustomization.eyeColor} 0%, #000 100%)`;
            }

            if (!eye.querySelector('.pupil') && ['star', 'rainbow', 'heart', 'cool'].includes(mascotCustomization.eyeStyle)) {

            } else if (!eye.innerHTML.includes('div') || mascotCustomization.eyeStyle === 'normal') {
                eye.innerHTML = '';
                eye.appendChild(pupil);
            }
        });

        const nose = document.getElementById(`${prefix}BearNose`);
        if (nose) {
            switch (mascotCustomization.noseStyle) {
                case 'small':
                    nose.style.width = '12px';
                    nose.style.height = '10px';
                    nose.style.background = `linear-gradient(145deg, ${mascotCustomization.noseColor} 0%, #000 100%)`;
                    break;
                case 'big':
                    nose.style.width = '24px';
                    nose.style.height = '20px';
                    nose.style.background = `linear-gradient(145deg, ${mascotCustomization.noseColor} 0%, #000 100%)`;
                    break;
                case 'button':
                    nose.style.borderRadius = '50%';
                    nose.style.width = '16px';
                    nose.style.height = '16px';
                    nose.style.background = `radial-gradient(circle, ${mascotCustomization.noseColor} 0%, #000 70%)`;
                    break;
                case 'heart':
                    nose.innerHTML = '<div style="color: #ff69b4; font-size: 14px;">💗</div>';
                    nose.style.display = 'flex';
                    nose.style.alignItems = 'center';
                    nose.style.justifyContent = 'center';
                    nose.style.background = 'transparent';
                    break;
                default:
                    nose.style.width = '18px';
                    nose.style.height = '15px';
                    nose.style.borderRadius = '50% 50% 40% 40%';
                    nose.style.background = `linear-gradient(145deg, ${mascotCustomization.noseColor} 0%, #000 100%)`;
                    nose.innerHTML = '';
            }
        }

        const mouth = document.getElementById(`${prefix}BearMouth`);
        if (mouth) {
            mouth.style.border = '4px solid #2c2c2c';
            mouth.style.borderTop = 'none';

            switch (mascotCustomization.mouthStyle) {
                case 'surprised':
                    mouth.style.borderRadius = '50%';
                    mouth.style.width = '18px';
                    mouth.style.height = '25px';
                    mouth.style.border = '4px solid #2c2c2c';
                    break;
                case 'neutral':
                    mouth.style.borderRadius = '0';
                    mouth.style.width = '25px';
                    mouth.style.height = '3px';
                    mouth.style.border = '3px solid #2c2c2c';
                    mouth.style.borderTop = 'none';
                    break;
                case 'playful':
                    mouth.style.borderRadius = '0 50px 50px 0';
                    mouth.style.width = '22px';
                    mouth.style.height = '12px';
                    break;
                case 'laugh':
                    mouth.style.borderRadius = '0 0 50px 50px';
                    mouth.style.width = '40px';
                    mouth.style.height = '20px';
                    mouth.style.border = '4px solid #2c2c2c';
                    mouth.style.borderTop = 'none';
                    break;
                case 'cute':
                    mouth.innerHTML = '<div style="color: #ff69b4; font-size: 16px; margin-top: -8px;">💋</div>';
                    mouth.style.border = 'none';
                    mouth.style.display = 'flex';
                    mouth.style.alignItems = 'center';
                    mouth.style.justifyContent = 'center';
                    break;
                default:
                    mouth.style.borderRadius = '0 0 35px 35px';
                    mouth.style.width = '35px';
                    mouth.style.height = '18px';
                    mouth.style.border = '4px solid #2c2c2c';
                    mouth.style.borderTop = 'none';
                    mouth.innerHTML = '';
            }
        }

        applyAccessories(prefix);
    });
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                  (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                  (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function applyAccessories(prefix) {
    const existingAccessories = document.querySelectorAll(`[id*="${prefix}Accessory"]`);
    existingAccessories.forEach(acc => acc.remove());

    const bearHead = document.getElementById(`${prefix}BearHead`) || 
                     document.querySelector(`#bear${prefix} .bear-head`);
    const bearBody = document.getElementById(`${prefix}BearBody`) || 
                     document.querySelector(`#bear${prefix} .bear-body`);

    if (!bearHead) return;

    if (mascotCustomization.accessories.glasses) {
        const glasses = document.createElement('div');
        glasses.id = `${prefix}AccessoryGlasses`;
        glasses.style.position = 'absolute';
        glasses.style.top = '35px';
        glasses.style.left = '25px';
        glasses.style.width = '70px';
        glasses.style.height = '25px';
        glasses.style.border = '3px solid #333';
        glasses.style.borderRadius = '50%';
        glasses.style.background = 'rgba(0,100,200,0.3)';
        glasses.style.zIndex = '10';
        glasses.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

        glasses.innerHTML = `
            <div style="position: absolute; top: 8px; left: 32px; width: 6px; height: 3px; background: #333; border-radius: 2px;"></div>
            <div style="position: absolute; top: -3px; left: 45px; width: 20px; height: 20px; border: 3px solid #333; border-radius: 50%; background: rgba(0,100,200,0.3);"></div>
        `;
        bearHead.appendChild(glasses);
    }

    if (mascotCustomization.accessories.hat) {
        const hat = document.createElement('div');
        hat.id = `${prefix}AccessoryHat`;
        hat.style.position = 'absolute';
        hat.style.top = '-25px';
        hat.style.left = '15px';
        hat.style.width = '80px';
        hat.style.height = '40px';
        hat.style.background = 'linear-gradient(145deg, #8B4513, #654321)';
        hat.style.borderRadius = '50% 50% 10% 10%';
        hat.style.border = '2px solid #333';
        hat.style.zIndex = '5';
        hat.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        bearHead.appendChild(hat);
    }

    if (mascotCustomization.accessories.cap) {
        const cap = document.createElement('div');
        cap.id = `${prefix}AccessoryCap`;
        cap.style.position = 'absolute';
        cap.style.top = '-20px';
        cap.style.left = '10px';
        cap.style.width = '90px';
        cap.style.height = '35px';
        cap.style.background = 'linear-gradient(145deg, #ff4444, #cc0000)';
        cap.style.borderRadius = '45px 45px 5px 5px';
        cap.style.border = '2px solid #333';
        cap.style.zIndex = '5';
        cap.innerHTML = `
            <div style="position: absolute; top: 25px; left: -10px; width: 40px; height: 8px; background: #cc0000; border-radius: 20px; transform: rotate(-10deg);"></div>
        `;
        bearHead.appendChild(cap);
    }

    if (mascotCustomization.accessories.headband) {
        const headband = document.createElement('div');
        headband.id = `${prefix}AccessoryHeadband`;
        headband.style.position = 'absolute';
        headband.style.top = '10px';
        headband.style.left = '10px';
        headband.style.width = '90px';
        headband.style.height = '12px';
        headband.style.background = 'linear-gradient(45deg, #ff69b4, #ff1493)';
        headband.style.borderRadius = '10px';
        headband.style.border = '1px solid #333';
        headband.style.zIndex = '8';
        headband.innerHTML = `
            <div style="position: absolute; top: -8px; left: 35px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 15px solid #ff69b4;"></div>
        `;
        bearHead.appendChild(headband);
    }

    if (mascotCustomization.accessories.earrings) {
        const leftEarring = document.createElement('div');
        leftEarring.id = `${prefix}AccessoryEarringLeft`;
        leftEarring.style.position = 'absolute';
        leftEarring.style.top = '15px';
        leftEarring.style.left = '0px';
        leftEarring.style.width = '8px';
        leftEarring.style.height = '8px';
        leftEarring.style.background = 'radial-gradient(circle, #ffd700, #ffb700)';
        leftEarring.style.borderRadius = '50%';
        leftEarring.style.border = '1px solid #333';
        leftEarring.style.zIndex = '10';
        leftEarring.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        const rightEarring = leftEarring.cloneNode(true);
        rightEarring.id = `${prefix}AccessoryEarringRight`;
        rightEarring.style.left = '102px';

        bearHead.appendChild(leftEarring);
        bearHead.appendChild(rightEarring);
    }

    if (mascotCustomization.accessories.bowtie && bearBody) {
        const bowtie = document.createElement('div');
        bowtie.id = `${prefix}AccessoryBowtie`;
        bowtie.style.position = 'absolute';
        bowtie.style.top = '10px';
        bowtie.style.left = '45px';
        bowtie.style.width = '30px';
        bowtie.style.height = '15px';
        bowtie.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
        bowtie.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
        bowtie.style.border = '2px solid #333';
        bowtie.style.zIndex = '10';
        bowtie.innerHTML = `
            <div style="position: absolute; top: 3px; left: 12px; width: 6px; height: 9px; background: #990000; border-radius: 2px;"></div>
        `;
        bearBody.appendChild(bowtie);
    }

    if (mascotCustomization.accessories.chain && bearBody) {
        const chain = document.createElement('div');
        chain.id = `${prefix}AccessoryChain`;
        chain.style.position = 'absolute';
        chain.style.top = '20px';
        chain.style.left = '20px';
        chain.style.width = '80px';
        chain.style.height = '4px';
        chain.style.background = 'linear-gradient(90deg, #ffd700, #ffb700, #ffd700)';
        chain.style.borderRadius = '2px';
        chain.style.border = '1px solid #333';
        chain.style.zIndex = '10';
        chain.innerHTML = `
            <div style="position: absolute; top: -6px; left: 35px; width: 10px; height: 10px; background: #ffd700; border-radius: 50%; border: 1px solid #333;"></div>
        `;
        bearBody.appendChild(chain);
    }

    if (mascotCustomization.accessories.scarf && bearBody) {
        const scarf = document.createElement('div');
        scarf.id = `${prefix}AccessoryScarf`;
        scarf.style.position = 'absolute';
        scarf.style.top = '5px';
        scarf.style.left = '10px';
        scarf.style.width = '100px';
        scarf.style.height = '20px';
        scarf.style.background = 'repeating-linear-gradient(45deg, #ff6b6b, #ff6b6b 10px, #4ecdc4 10px, #4ecdc4 20px)';
        scarf.style.borderRadius = '10px';
        scarf.style.border = '1px solid #333';
        scarf.style.zIndex = '9';
        scarf.style.transform = 'rotate(-5deg)';
        bearBody.appendChild(scarf);
    }
}

function saveMascotCustomization() {
    gameState.user.mascotCustomization = { ...mascotCustomization };
    saveUserProgress();

    // Volver al perfil
    showProfile();

    updateMascotMessage('Tu mascota ha sido personalizada y se ve increible');
}

// Funciones de perfil y configuraciones
function updateProfileData() {
    if (!gameState.user) return;

    document.getElementById('profileName').value = gameState.user.name || '';
    document.getElementById('profileEmail').value = gameState.user.email || '';
    document.getElementById('profileAge').value = gameState.user.age || 'kid';

    document.getElementById('profileStreak').textContent = gameState.user.streak || 0;
    document.getElementById('profileGems').textContent = gameState.user.gems || 0;
    document.getElementById('profileLevel').textContent = gameState.user.level || 1;

    const accuracy = gameState.user.totalQuestions > 0 ? 
        Math.round((gameState.user.totalCorrect / gameState.user.totalQuestions) * 100) : 0;
    document.getElementById('profileAccuracy').textContent = accuracy + '%';
}

function editProfileName() {
    const nameInput = document.getElementById('profileName');
    nameInput.disabled = false;
    nameInput.focus();
    nameInput.addEventListener('blur', async () => {
        if (nameInput.value.trim()) {
            gameState.user.name = nameInput.value.trim();
            await saveUserProgress();
            updateMascotMessage('¡Nombre actualizado correctamente!');
        }
        nameInput.disabled = true;
    });
}

function editProfileEmail() {
    const emailInput = document.getElementById('profileEmail');
    emailInput.disabled = false;
    emailInput.focus();
    emailInput.addEventListener('blur', async () => {
        if (emailInput.value.trim() && isValidEmail(emailInput.value)) {
            try {
                await gameState.currentUser.updateEmail(emailInput.value);
                gameState.user.email = emailInput.value;
                await saveUserProgress();
                updateMascotMessage('¡Correo actualizado correctamente!');
            } catch (error) {
                console.error('Error actualizando email:', error);
                updateMascotMessage('Error al actualizar el correo. Intenta de nuevo.');
                emailInput.value = gameState.user.email;
            }
        }
        emailInput.disabled = true;
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function loadSettings() {
    if (gameState.user && gameState.user.settings) {
        Object.assign(appSettings, gameState.user.settings);
    }

    document.getElementById('languageSelect').value = appSettings.language;
    document.getElementById('soundEffects').checked = appSettings.soundEffects;
    document.getElementById('adaptiveDifficulty').checked = appSettings.adaptiveDifficulty;
    document.getElementById('errorAnalysis').checked = appSettings.errorAnalysis;
}

function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    appSettings.language = language;
    saveSettings();
    updateMascotMessage(language === 'es' ? '¡Idioma cambiado a español!' : 'Language changed to ' + language + '!');
}

function toggleSoundEffects() {
    appSettings.soundEffects = document.getElementById('soundEffects').checked;
    saveSettings();
    playSound('click');
    updateMascotMessage(appSettings.soundEffects ? '¡Efectos de sonido activados!' : 'Efectos de sonido desactivados');
}

function toggleAdaptiveDifficulty() {
    appSettings.adaptiveDifficulty = document.getElementById('adaptiveDifficulty').checked;
    saveSettings();
    playSound('click');
    updateMascotMessage(appSettings.adaptiveDifficulty ? 
        'Dificultad automática activada. Ajustaré los problemas a tu nivel.' : 
        'Dificultad automática desactivada.');
}

function toggleErrorAnalysis() {
    appSettings.errorAnalysis = document.getElementById('errorAnalysis').checked;
    saveSettings();
    playSound('click');
    updateMascotMessage(appSettings.errorAnalysis ? 
        'Analizaré tus errores para ayudarte mejor.' : 
        'Análisis de errores desactivado.');
}

function saveSettings() {
    gameState.user.settings = { ...appSettings };
    saveUserProgress();
}

function showAbout() {
    updateMascotMessage('BeMaa v1.0 - Tu compañero de matemáticas. Creado con ❤️ para hacer las matemáticas divertidas.');
}

function showHelp() {
    updateMascotMessage('¿Necesitas ayuda? Puedes contactarnos en help@bemaa.com o visitar nuestra sección de preguntas frecuentes.');
}

function showPrivacyPolicy() {
    updateMascotMessage('Tu privacidad es importante. Nunca compartimos tus datos personales sin tu consentimiento.');
}

function resetProgress() {
    if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
        gameState.user.level = 1;
        gameState.user.streak = 0;
        gameState.user.gems = 100;
        gameState.user.lives = 5;
        gameState.user.totalCorrect = 0;
        gameState.user.totalQuestions = 0;
        gameState.user.weakAreas = [];
        gameState.user.strengths = [];

        lessons.forEach(lesson => lesson.progress = 0);

        saveUserProgress();
        updateUserStats();
        updateMascotMessage('Tu progreso ha sido reiniciado. ¡Comencemos de nuevo!');
    }
}

async function deleteAccount() {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos.')) {
        try {
            await database.ref('users/' + gameState.currentUser.uid).remove();
            await gameState.currentUser.delete();
            updateMascotMessage('Tu cuenta ha sido eliminada. ¡Esperamos verte de nuevo pronto!');
            showAuthScreen();
        } catch (error) {
            console.error('Error eliminando cuenta:', error);
            updateMascotMessage('Error al eliminar la cuenta. Intenta de nuevo.');
        }
    }
}

// Utilidades
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function updateMascotMessage(message, targetElement = 'mascotSpeech') {
    const speechElement = document.getElementById(targetElement);
    if (speechElement) {
        speechElement.textContent = message;
    }

    const speechElements = ['mascotSpeech', 'mascotSpeechLessons', 'mascotSpeechGame'];
    speechElements.forEach(id => {
        const element = document.getElementById(id);
        if (element && id !== targetElement) {
            element.textContent = message;
        }
    });

    playMascotAnimation();
}

function playMascotAnimation() {
    const bears = ['bearHome', 'bearLessons', 'bearGame', 'previewBear'];

    bears.forEach(bearId => {
        const bear = document.getElementById(bearId);
        if (bear && isElementVisible(bear)) {
            bear.classList.add('speaking');
            setTimeout(() => {
                bear.classList.remove('speaking');
            }, 800);
        }
    });
}

function isElementVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           window.getComputedStyle(element).display !== 'none' &&
           window.getComputedStyle(element).visibility !== 'hidden';
}

function updateUserStats() {
    document.getElementById('streak').textContent = gameState.user.streak;
    document.getElementById('gems').textContent = gameState.user.gems;
    document.getElementById('lives').textContent = gameState.user.lives;

    // Actualizar stats en el panel lateral
    const streakDisplay = document.getElementById('streakDisplay');
    const gemsDisplay = document.getElementById('gemsDisplay');
    if (streakDisplay) streakDisplay.textContent = gameState.user.streak;
    if (gemsDisplay) gemsDisplay.textContent = gameState.user.gems;

    const userNameElement = document.getElementById('userName');
    if (userNameElement && gameState.user.name) {
        userNameElement.textContent = gameState.user.name;
    }
}

function updateRealTimeStats() {
    // Actualizar estadísticas en tiempo real
    const precisionElement = document.getElementById('realTimePrecision');
    const currentStreakElement = document.getElementById('currentStreak');
    const questionsCountElement = document.getElementById('questionsCount');
    
    if (precisionElement) {
        precisionElement.textContent = gameState.user.mathPrecision + '%';
    }
    
    if (currentStreakElement) {
        currentStreakElement.textContent = gameState.user.sessionStats.currentStreak;
    }
    
    if (questionsCountElement) {
        questionsCountElement.textContent = gameState.user.sessionStats.questionsAnswered;
    }
    
    // Actualizar barra de progreso de nivel
    const levelProgress = document.getElementById('levelProgress');
    if (levelProgress) {
        const progress = (gameState.user.mathPrecision / 100) * 100;
        levelProgress.style.width = progress + '%';
    }
}

async function saveUserProgress() {
    if (gameState.isAuthenticated && gameState.currentUser) {
        try {
            const updateData = {
                name: gameState.user.name,
                email: gameState.user.email,
                age: gameState.user.age,
                level: gameState.user.level,
                streak: gameState.user.streak,
                gems: gameState.user.gems,
                lives: gameState.user.lives,
                totalCorrect: gameState.user.totalCorrect,
                totalQuestions: gameState.user.totalQuestions,
                weakAreas: gameState.user.weakAreas,
                strengths: gameState.user.strengths,
                lastPlayed: firebase.database.ServerValue.TIMESTAMP
            };

            if (gameState.user.mascotCustomization) {
                updateData.mascotCustomization = gameState.user.mascotCustomization;
            }

            if (gameState.user.settings) {
                updateData.settings = gameState.user.settings;
            }

            await database.ref('users/' + gameState.currentUser.uid).update(updateData);
        } catch (error) {
            console.error('Error guardando progreso:', error);
        }
    }
}

setInterval(saveUserProgress, 30000);

document.addEventListener('DOMContentLoaded', function() {
    // Cargar sonidos personalizados
    loadCustomSounds();

    const savedProgress = localStorage.getItem('lessonsProgress');
    if (savedProgress) {
        try {
            const progressData = JSON.parse(savedProgress);
            progressData.forEach(saved => {
                const lesson = lessons.find(l => l.id === saved.id);
                if (lesson) {
                    lesson.progress = saved.progress;
                }
            });
        } catch (e) {
            console.log('Error cargando progreso de lecciones:', e);
        }
    }

    // Mensaje de bienvenida inicial
    updateMascotMessage('¡Hola! Soy BeMaa, tu compañero matemático. ¿Estás listo para una aventura de aprendizaje?');

    if (gameState.isAuthenticated && gameState.currentUser) {
        showHome();
    } else {
        showAuthScreen();
    }
    updateUserStats();

    window.onclick = function(event) {
        const modal = document.getElementById('calculatorModal');
        if (event.target === modal) {
            closeCalculator();
        }
    };

    setInterval(() => {
        if (gameState.user.lives < 5) {
            gameState.user.lives++;
            updateUserStats();
            updateMascotMessage('¡Recuperaste una vida! ❤️');
        }
    }, 3600000);
});
