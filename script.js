

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
    currentScreen: 'intro',
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
        strengths: []
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
        icon: '➕',
        description: 'Aprende a sumar números',
        levels: 10,
        progress: 0,
        difficulty: 1
    },
    {
        id: 'resta',
        title: 'Resta',
        icon: '➖',
        description: 'Domina la resta',
        levels: 10,
        progress: 0,
        difficulty: 1
    },
    {
        id: 'multiplicacion',
        title: 'Multiplicación',
        icon: '✖️',
        description: 'Tablas de multiplicar',
        levels: 10,
        progress: 0,
        difficulty: 2
    },
    {
        id: 'division',
        title: 'División',
        icon: '➗',
        description: 'Divide y vencerás',
        levels: 10,
        progress: 0,
        difficulty: 2
    },
    {
        id: 'fracciones',
        title: 'Fracciones',
        icon: '½',
        description: 'Números quebrados',
        levels: 10,
        progress: 0,
        difficulty: 3
    },
    {
        id: 'algebra',
        title: 'Álgebra',
        icon: '📈',
        description: 'Ecuaciones básicas',
        levels: 10,
        progress: 0,
        difficulty: 4
    },
    {
        id: 'geometria',
        title: 'Geometría',
        icon: '📐',
        description: 'Formas y figuras',
        levels: 10,
        progress: 0,
        difficulty: 3
    },
    {
        id: 'porcentajes',
        title: 'Porcentajes',
        icon: '%',
        description: 'Cálculo de porcentajes',
        levels: 10,
        progress: 0,
        difficulty: 3
    }
];

// Algoritmo de dificultad adaptativa
function getAdaptiveDifficulty(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    const userAccuracy = gameState.user.totalQuestions > 0 ? 
        gameState.user.totalCorrect / gameState.user.totalQuestions : 0.5;
    
    let difficulty = lesson.difficulty;
    
    // Ajustar basado en rendimiento
    if (userAccuracy > 0.8) {
        difficulty += 1;
    } else if (userAccuracy < 0.5) {
        difficulty = Math.max(1, difficulty - 1);
    }
    
    // Considerar áreas débiles
    if (gameState.user.weakAreas.includes(lessonId)) {
        difficulty = Math.max(1, difficulty - 1);
    }
    
    return Math.min(5, Math.max(1, difficulty));
}

// Generador de preguntas inteligente
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
    const den2 = den1; // Mismo denominador para simplificar
    
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

// Algoritmo de detección de errores
function analyzeErrors(questionHistory) {
    const errorPatterns = {};
    const recentQuestions = questionHistory.slice(-10);
    
    recentQuestions.forEach(q => {
        if (!q.correct) {
            const topic = q.topic;
            if (!errorPatterns[topic]) {
                errorPatterns[topic] = 0;
            }
            errorPatterns[topic]++;
        }
    });
    
    // Identificar áreas débiles
    const weakAreas = Object.keys(errorPatterns).filter(topic => 
        errorPatterns[topic] >= 3
    );
    
    gameState.user.weakAreas = [...new Set([...gameState.user.weakAreas, ...weakAreas])];
    
    return {
        errorPatterns,
        recommendations: generateRecommendations(errorPatterns)
    };
}

function generateRecommendations(errorPatterns) {
    const recommendations = [];
    
    Object.keys(errorPatterns).forEach(topic => {
        const errors = errorPatterns[topic];
        if (errors >= 3) {
            recommendations.push({
                topic,
                message: `Te recomendamos practicar más ${topic}`,
                exercises: generateCorrectiveExercises(topic)
            });
        }
    });
    
    return recommendations;
}

function generateCorrectiveExercises(topic) {
    // Generar ejercicios específicos para el área débil
    const exercises = [];
    for (let i = 0; i < 5; i++) {
        exercises.push(generateQuestion(topic, 1)); // Dificultad reducida
    }
    return exercises;
}

// Sistema de recompensas
function calculateRewards(score, accuracy, time, mode) {
    let gems = Math.floor(score / 10);
    let experience = score;
    
    // Bonificaciones
    if (accuracy >= 0.9) gems += 10; // Precisión alta
    if (accuracy === 1.0) gems += 20; // Perfecto
    if (time < 60) gems += 5; // Velocidad
    
    // Multiplicadores por modo
    const multipliers = {
        normal: 1,
        challenge: 1.5,
        survival: 2
    };
    
    gems = Math.floor(gems * multipliers[mode]);
    experience = Math.floor(experience * multipliers[mode]);
    
    return { gems, experience };
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
        updateMascotMessage('Por favor completa todos los campos para crear tu cuenta.');
        return;
    }
    
    if (password !== confirmPassword) {
        updateMascotMessage('Las contraseñas no coinciden. Verifica que sean iguales.');
        return;
    }
    
    if (password.length < 6) {
        updateMascotMessage('La contraseña debe tener al menos 6 caracteres para ser segura.');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Guardar información adicional en la base de datos
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
                bodyColor: '#8B4513',
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
        
        updateMascotMessage(`¡Bienvenido ${name}! ¡Tu aventura matemática comienza ahora! 🎉`);
        
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
            default:
                errorMessage = 'Error al crear la cuenta: ' + error.message;
        }
        
        updateMascotMessage(errorMessage);
    }
}

async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error al iniciar sesión: ' + error.message);
    }
}

async function loginWithGoogle() {
    // Deshabilitar Google Sign-in temporalmente debido a problemas de dominio
    updateMascotMessage('Lo siento, el inicio de sesión con Google no está disponible en este momento. Por favor usa el registro manual con email y contraseña.');
    return;
    
    /* Código comentado hasta que se configure el dominio autorizado
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Verificar si es un usuario nuevo
        const userRef = database.ref('users/' + user.uid);
        const snapshot = await userRef.once('value');
        
        if (!snapshot.exists()) {
            // Usuario nuevo, crear perfil
            await userRef.set({
                name: user.displayName,
                email: user.email,
                age: 'adult', // Por defecto
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
                    bodyColor: '#8B4513',
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
        }
        
        updateMascotMessage(`¡Hola ${user.displayName}! ¡Me alegra verte de nuevo! 🐻`);
        
    } catch (error) {
        console.error('Error en login con Google:', error);
        
        // Manejar errores específicos
        let errorMessage = 'Error al iniciar sesión con Google.';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Proceso de inicio de sesión cancelado.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Popup bloqueado. Permite popups para este sitio.';
                break;
            case 'auth/unauthorized-domain':
                errorMessage = 'Este dominio no está autorizado para Google Sign-in. Usa el registro manual.';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Solicitud cancelada. Intenta de nuevo.';
                break;
            default:
                errorMessage = error.message;
        }
        
        updateMascotMessage(`Error: ${errorMessage}`);
        console.log('Código de error:', error.code);
    }
    */
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

// Variable para controlar mensajes de bienvenida
let hasShownWelcomeMessage = false;

// Listener de cambios de autenticación
auth.onAuthStateChanged(async (user) => {
    console.log('Estado de autenticación cambió:', user ? 'Usuario conectado' : 'Usuario desconectado');
    
    if (user) {
        try {
            gameState.isAuthenticated = true;
            gameState.currentUser = user;
            
            // Verificar que el usuario esté realmente autenticado
            const token = await user.getIdToken(true);
            if (!token) {
                console.error('No se pudo obtener token de usuario');
                await auth.signOut();
                return;
            }
            
            // Cargar datos del usuario
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
                    strengths: userData.strengths || [],
                    mascotCustomization: userData.mascotCustomization || {
                        bodyColor: '#8B4513',
                        eyeStyle: 'normal',
                        mouthStyle: 'happy',
                        accessories: {
                            hat: false,
                            glasses: false,
                            bowtie: false,
                            scarf: false
                        }
                    },
                    settings: userData.settings || {
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
                };
                
                // Cargar personalización y configuraciones
                if (userData.mascotCustomization) {
                    Object.assign(mascotCustomization, userData.mascotCustomization);
                }
                if (userData.settings) {
                    Object.assign(appSettings, userData.settings);
                }
            }
            
            // Solo cambiar de pantalla si estamos en intro o auth
            if (gameState.currentScreen === 'intro' || gameState.currentScreen === 'auth') {
                showHome();
            }
            updateUserStats();
            
            // Mostrar mensaje de bienvenida solo una vez después del intro
            if (!hasShownWelcomeMessage && gameState.currentScreen === 'home') {
                setTimeout(() => {
                    updateMascotMessage(`¡Hola ${gameState.user.name}! Soy BeMaa, tu compañero matemático. ¿Listo para la aventura?`, 'mascotSpeech');
                    hasShownWelcomeMessage = true;
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error en autenticación:', error);
            gameState.isAuthenticated = false;
            gameState.currentUser = null;
            if (gameState.currentScreen !== 'intro') {
                showAuthScreen();
            }
        }
        
    } else {
        gameState.isAuthenticated = false;
        gameState.currentUser = null;
        hasShownWelcomeMessage = false; // Resetear mensaje de bienvenida
        
        // Solo redirigir si no estamos en intro
        if (gameState.currentScreen !== 'intro') {
            showAuthScreen();
        }
    }
});

// Funciones de navegación
function showIntro() {
    hideAllScreens();
    document.getElementById('introScreen').classList.add('active');
    gameState.currentScreen = 'intro';
    
    // Secuencia de animaciones
    setTimeout(() => {
        showAuthScreen();
    }, 6000); // 6 segundos de intro
}

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
    
    hideAllScreens();
    hideBottomNav();
    document.getElementById('homeScreen').classList.add('active');
    document.getElementById('bottomNav').style.display = 'flex';
    gameState.currentScreen = 'home';
    
    // Renderizar lecciones en la página de inicio
    renderLessons();
    
    // Actualizar navegación activa
    updateActiveNav('home');
    
    // Solo mostrar mensaje si no se ha mostrado antes o si es navegación manual
    if (!hasShownWelcomeMessage) {
        updateMascotMessage(`¡Hola ${gameState.user.name}! Soy BeMaa, tu compañero matemático. ¿Listo para la aventura?`, 'mascotSpeech');
        hasShownWelcomeMessage = true;
    } else {
        // Mensaje más corto para navegación posterior
        updateMascotMessage(`¡Hola ${gameState.user.name}! ¿Qué quieres hacer hoy?`, 'mascotSpeech');
    }
}

function showLessons() {
    hideAllScreens();
    document.getElementById('lessonsScreen').classList.add('active');
    gameState.currentScreen = 'lessons';
    renderLessons();
    updateMascotMessage('¿Qué tema quieres practicar hoy? Elige la lección que más te guste.', 'mascotSpeechLessons');
}

function showProfile() {
    updateMascotMessage('¡Mira tu progreso! Vas muy bien.');
    // Implementar pantalla de perfil
}

function showShop() {
    updateMascotMessage('¿Quieres comprar algo para tu mascota?');
    // Implementar tienda
}

function showStats() {
    updateMascotMessage('Estas son tus estadísticas. ¡Sigue así!');
    // Implementar estadísticas
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
    
    lessons.forEach(lesson => {
        const card = document.createElement('div');
        card.className = 'lesson-card';
        card.onclick = () => selectLesson(lesson.id);
        
        card.innerHTML = `
            <div class="lesson-icon">${lesson.icon}</div>
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-progress">
                <div class="lesson-progress-fill" style="width: ${lesson.progress}%"></div>
            </div>
            <div class="lesson-level">Nivel ${Math.floor(lesson.progress / 10) + 1}/10</div>
        `;
        
        grid.appendChild(card);
    });
}

function selectLesson(lessonId) {
    gameState.currentLesson = lessonId;
    updateMascotMessage(`¡Excelente elección! Vamos a practicar ${lessons.find(l => l.id === lessonId).title}.`);
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
    
    // Generar preguntas
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
    
    // Mensaje inicial del juego
    const lessonName = lessons.find(l => l.id === gameState.currentLesson)?.title || 'matemáticas';
    updateMascotMessage(`¡Perfecto! Vamos a practicar ${lessonName}. Lee bien cada pregunta y piensa antes de responder.`, 'mascotSpeechGame');
    
    setTimeout(showQuestion, 2000); // Dar tiempo para que termine de hablar
}

function showQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    document.getElementById('questionNum').textContent = gameState.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = gameState.questions.length;
    document.getElementById('questionText').textContent = question.question;
    
    // Actualizar barra de progreso
    const progress = ((gameState.currentQuestionIndex) / gameState.questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Mostrar respuestas
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(answer);
        container.appendChild(button);
    });
    
    // Actualizar vidas
    document.getElementById('livesCount').textContent = gameState.user.lives;
}

function selectAnswer(selectedAnswer) {
    const question = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = selectedAnswer == question.correct;
    
    // Actualizar estadísticas
    gameState.user.totalQuestions++;
    if (isCorrect) {
        gameState.user.totalCorrect++;
        gameState.score += 10;
    }
    
    // Feedback visual
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        if (btn.textContent == question.correct) {
            btn.classList.add('correct');
        } else if (btn.textContent == selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });
    
    // Feedback de mascota
    if (isCorrect) {
        updateMascotMessage('¡Increíble! ¡Eres genial! Esa respuesta está perfecta.', 'mascotSpeechGame');
        const mascotGame = document.getElementById('bearGame');
        if (mascotGame) mascotGame.classList.add('pulse');
        playSuccessSound();
    } else {
        updateMascotMessage('¡Tranquilo! Los osos también nos equivocamos. Vamos a intentarlo de nuevo.', 'mascotSpeechGame');
        const mascotGame = document.getElementById('bearGame');
        if (mascotGame) mascotGame.classList.add('shake');
        playErrorSound();
        gameState.user.lives--;
        
        if (gameState.currentMode === 'survival' && gameState.user.lives <= 0) {
            endGame();
            return;
        }
    }
    
    // Limpiar animaciones
    setTimeout(() => {
        const mascotGame = document.getElementById('bearGame');
        if (mascotGame) {
            mascotGame.classList.remove('pulse', 'shake');
        }
    }, 1000);
    
    // Continuar al siguiente
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame();
    } else {
        showQuestion();
    }
}

function endGame() {
    hideAllScreens();
    document.getElementById('resultsScreen').classList.add('active');
    
    const totalTime = (Date.now() - gameState.timeStart) / 1000;
    const accuracy = gameState.user.totalCorrect / gameState.user.totalQuestions;
    const rewards = calculateRewards(gameState.score, accuracy, totalTime, gameState.currentMode);
    
    // Actualizar gemas
    gameState.user.gems += rewards.gems;
    
    // Mostrar resultados
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('accuracy').textContent = Math.round(accuracy * 100) + '%';
    document.getElementById('gemsEarned').textContent = rewards.gems;
    
    // Actualizar racha
    if (accuracy >= 0.8) {
        gameState.user.streak++;
    } else {
        gameState.user.streak = 0;
    }
    
    // Mostrar logros
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
    
    // Actualizar UI
    updateUserStats();
    
    // Mensaje de mascota
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

// Funciones de ayuda
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
    // Actualizar texto en el elemento especificado
    const speechElement = document.getElementById(targetElement);
    if (speechElement) {
        speechElement.textContent = message;
    }
    
    // También actualizar en otros elementos de speech si existen
    const speechElements = ['mascotSpeech', 'mascotSpeechLessons', 'mascotSpeechGame'];
    speechElements.forEach(id => {
        const element = document.getElementById(id);
        if (element && id !== targetElement) {
            element.textContent = message;
        }
    });
    
    // Reproducir voz en español
    speakText(message);
}

function speakText(text) {
    // Cancelar cualquier síntesis de voz en curso
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        stopSpeakingAnimation();
    }
    
    // Verificar si la síntesis de voz está disponible
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configurar voz en español masculino
        utterance.lang = 'es-ES';
        utterance.rate = 0.9; // Velocidad natural
        utterance.pitch = 0.8; // Tono más grave para oso masculino
        utterance.volume = 0.8;
        
        // Buscar voz masculina en español
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(voice => 
            voice.lang.startsWith('es') && 
            (voice.name.toLowerCase().includes('male') || 
             voice.name.toLowerCase().includes('man') ||
             voice.name.toLowerCase().includes('diego') ||
             voice.name.toLowerCase().includes('jorge'))
        ) || voices.find(voice => voice.lang.startsWith('es'));
        
        if (spanishVoice) {
            utterance.voice = spanishVoice;
        }
        
        // Eventos de la síntesis de voz
        utterance.onstart = () => {
            startSpeakingAnimation();
        };
        
        utterance.onend = () => {
            stopSpeakingAnimation();
        };
        
        utterance.onerror = () => {
            stopSpeakingAnimation();
            console.log('Error en síntesis de voz, usando sonido alternativo');
            playMascotSound();
        };
        
        // Reproducir la voz
        window.speechSynthesis.speak(utterance);
    } else {
        // Fallback a sonido sintético si no hay síntesis de voz
        playMascotSound();
    }
}

function startSpeakingAnimation() {
    // Animar todos los osos que estén visibles
    const bears = ['bearHome', 'bearLessons', 'bearGame'];
    const mouths = ['bearMouthHome', 'bearMouthLessons', 'bearMouthGame'];
    
    bears.forEach(bearId => {
        const bear = document.getElementById(bearId);
        if (bear && isElementVisible(bear)) {
            bear.classList.add('speaking');
        }
    });
    
    mouths.forEach(mouthId => {
        const mouth = document.getElementById(mouthId);
        if (mouth && isElementVisible(mouth)) {
            mouth.classList.add('speaking');
        }
    });
}

function stopSpeakingAnimation() {
    // Detener animación de todos los osos
    const bears = ['bearHome', 'bearLessons', 'bearGame'];
    const mouths = ['bearMouthHome', 'bearMouthLessons', 'bearMouthGame'];
    
    bears.forEach(bearId => {
        const bear = document.getElementById(bearId);
        if (bear) {
            bear.classList.remove('speaking');
        }
    });
    
    mouths.forEach(mouthId => {
        const mouth = document.getElementById(mouthId);
        if (mouth) {
            mouth.classList.remove('speaking');
        }
    });
}

function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           window.getComputedStyle(element).display !== 'none' &&
           window.getComputedStyle(element).visibility !== 'hidden';
}

function playMascotSound() {
    // Sonido sintético como fallback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Más grave para oso
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
    
    // Animar durante el sonido sintético
    startSpeakingAnimation();
    setTimeout(stopSpeakingAnimation, 150);
}

// Asegurar que las voces estén cargadas
window.speechSynthesis.onvoiceschanged = function() {
    // Las voces están ahora disponibles
};

function playSuccessSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playErrorSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

function updateUserStats() {
    document.getElementById('streak').textContent = gameState.user.streak;
    document.getElementById('gems').textContent = gameState.user.gems;
    document.getElementById('lives').textContent = gameState.user.lives;
    
    const userNameElement = document.getElementById('userName');
    if (userNameElement && gameState.user.name) {
        userNameElement.textContent = gameState.user.name;
    }
}

// Funciones para guardar progreso
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
            
            // Agregar personalización de mascota si existe
            if (gameState.user.mascotCustomization) {
                updateData.mascotCustomization = gameState.user.mascotCustomization;
            }
            
            // Agregar configuraciones si existen
            if (gameState.user.settings) {
                updateData.settings = gameState.user.settings;
            }
            
            await database.ref('users/' + gameState.currentUser.uid).update(updateData);
        } catch (error) {
            console.error('Error guardando progreso:', error);
        }
    }
}

// Guardar progreso automáticamente cada cierto tiempo
setInterval(saveUserProgress, 30000); // Cada 30 segundos

// Mantener sesión activa verificando token cada 10 minutos
setInterval(async () => {
    if (gameState.isAuthenticated && gameState.currentUser) {
        try {
            // Verificar que el token siga siendo válido
            await gameState.currentUser.getIdToken(true);
            console.log('Sesión verificada correctamente');
        } catch (error) {
            console.error('Error verificando sesión:', error);
            // Si hay error, cerrar sesión
            await auth.signOut();
            updateMascotMessage('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
        }
    }
}, 600000); // Cada 10 minutos

// Detectar cuando la página pierde/gana foco para mantener sesión
document.addEventListener('visibilitychange', async () => {
    if (!document.hidden && gameState.isAuthenticated && gameState.currentUser) {
        try {
            // Verificar sesión cuando la página vuelve a estar activa
            await gameState.currentUser.getIdToken(true);
        } catch (error) {
            console.error('Sesión perdida al volver a la página:', error);
            await auth.signOut();
            updateMascotMessage('Tu sesión se perdió. Inicia sesión de nuevo.');
        }
    }
});

// Funciones de navegación bottom tab
function navigateToHome() {
    showHome();
    closeProfileMenu();
}

function updateActiveNav(activeTab) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItems = document.querySelectorAll('.nav-item');
    if (activeTab === 'home' && navItems[0]) navItems[0].classList.add('active');
    if (activeTab === 'shop' && navItems[1]) navItems[1].classList.add('active');
    if (activeTab === 'more' && navItems[2]) navItems[2].classList.add('active');
}

function hideBottomNav() {
    document.getElementById('bottomNav').style.display = 'none';
}

function showBottomNav() {
    document.getElementById('bottomNav').style.display = 'flex';
}

function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
    updateActiveNav('more');
}

function closeProfileMenu() {
    document.getElementById('profileMenu').classList.remove('active');
}

// Funciones para tabs de perfil
function switchProfileTab(tabName) {
    // Remover active de todas las tabs
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos los contenidos
    document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar la tab seleccionada
    event.target.classList.add('active');
    
    // Activar el contenido correspondiente
    const tabMap = {
        'stats': 'statsTab',
        'info': 'infoTab',
        'achievements': 'achievementsTab',
        'settings': 'settingsTab'
    };
    
    const contentId = tabMap[tabName];
    if (contentId) {
        document.getElementById(contentId).classList.add('active');
    }
    
    // Cargar logros si es necesario
    if (tabName === 'achievements') {
        loadAchievements();
    }
}

function loadAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const userAchievements = [
        { icon: '🏅', name: 'Primer Triunfo', unlocked: gameState.user.totalCorrect > 0 },
        { icon: '🏆', name: 'Puntuación Perfecta', unlocked: false },
        { icon: '⚡', name: 'Rápido', unlocked: false },
        { icon: '🔥', name: 'Racha de 7', unlocked: gameState.user.streak >= 7 },
        { icon: '💎', name: 'Rico en Gemas', unlocked: gameState.user.gems >= 1000 },
        { icon: '🎯', name: 'Precisión 90%', unlocked: (gameState.user.totalCorrect / gameState.user.totalQuestions) >= 0.9 }
    ];
    
    userAchievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;
        grid.appendChild(card);
    });
}

function editProfile() {
    // Aquí podrías implementar un modal de edición o navegar a una pantalla de edición
    updateMascotMessage('Función de edición de perfil próximamente disponible.');
}

// Redefinir showProfile para usar la nueva estructura
function showProfile() {
    if (!gameState.isAuthenticated) {
        showAuthScreen();
        return;
    }
    
    hideAllScreens();
    hideBottomNav();
    document.getElementById('profileScreen').classList.add('active');
    gameState.currentScreen = 'profile';
    updateProfileData();
    closeProfileMenu();
    updateMascotMessage('¡Este es tu perfil! Aquí puedes ver tu progreso.');
}

// Actualizar función showMascotCustomization
function showMascotCustomization() {
    hideAllScreens();
    hideBottomNav();
    document.getElementById('mascotCustomizationScreen').classList.add('active');
    gameState.currentScreen = 'mascotCustomization';
    loadMascotCustomization();
    applyMascotCustomization('preview');
    updateMascotMessage('¡Hagamos que tu avatar sea único! Puedes cambiar colores, ojos, boca y más.');
}

// Actualizar función showSettings
function showSettings() {
    hideAllScreens();
    hideBottomNav();
    document.getElementById('settingsScreen').classList.add('active');
    gameState.currentScreen = 'settings';
    loadSettings();
    closeProfileMenu();
    updateMascotMessage('Aquí puedes ajustar la aplicación a tu gusto.');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    showIntro();
    updateUserStats();
    
    // Cerrar menú de perfil al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('calculatorModal');
        const profileMenu = document.getElementById('profileMenu');
        
        if (event.target === modal) {
            closeCalculator();
        }
        
        if (event.target === profileMenu) {
            closeProfileMenu();
        }
    };
    
    // Restaurar vidas cada hora
    setInterval(() => {
        if (gameState.user.lives < 5) {
            gameState.user.lives++;
            updateUserStats();
            updateMascotMessage('¡Recuperaste una vida! ❤️');
        }
    }, 3600000); // 1 hora
});

// Sistema de logros
const achievements = {
    firstWin: { name: 'Primer Triunfo', description: 'Responde tu primera pregunta correctamente', icon: '🏅' },
    perfectScore: { name: 'Puntuación Perfecta', description: 'Obtén 100% de precisión', icon: '🏆' },
    speedDemon: { name: 'Demonio de la Velocidad', description: 'Completa una lección en menos de 2 minutos', icon: '⚡' },
    streakMaster: { name: 'Maestro de Rachas', description: 'Mantén una racha de 7 días', icon: '🔥' },
    gemCollector: { name: 'Coleccionista de Gemas', description: 'Acumula 1000 gemas', icon: '💎' }
};

// Sistema de recomendaciones inteligente
function getSmartRecommendations() {
    const recommendations = [];
    
    // Basado en áreas débiles
    gameState.user.weakAreas.forEach(area => {
        recommendations.push({
            type: 'remedial',
            lesson: area,
            reason: 'Necesitas practicar más esta área',
            priority: 'high'
        });
    });
    
    // Basado en fortalezas
    gameState.user.strengths.forEach(area => {
        const nextLevel = lessons.find(l => l.id === area && l.difficulty < 5);
        if (nextLevel) {
            recommendations.push({
                type: 'advancement',
                lesson: area,
                reason: 'Estás listo para el siguiente nivel',
                priority: 'medium'
            });
        }
    });
    
    // Lecciones nuevas
    const untriedLessons = lessons.filter(l => l.progress === 0);
    if (untriedLessons.length > 0) {
        recommendations.push({
            type: 'exploration',
            lesson: untriedLessons[0].id,
            reason: 'Prueba algo nuevo',
            priority: 'low'
        });
    }
    
    return recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

// Estado de personalización de mascota
const mascotCustomization = {
    bodyColor: '#8B4513',
    eyeStyle: 'normal',
    eyeColor: '#000000',
    mouthStyle: 'happy',
    noseStyle: 'normal',
    noseColor: '#2c2c2c',
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
    backgroundMusic: false,
    volume: 50,
    adaptiveDifficulty: true,
    dailyReminders: false,
    vibration: false,
    shareProgress: false,
    errorAnalysis: true
};

// Funciones de navegación adicionales
function showProfile() {
    if (!gameState.isAuthenticated) {
        showAuthScreen();
        return;
    }
    
    hideAllScreens();
    document.getElementById('profileScreen').classList.add('active');
    gameState.currentScreen = 'profile';
    updateProfileData();
    updateMascotMessage('¡Este es tu perfil! Aquí puedes ver tu progreso y personalizar tu mascota.');
}

function showMascotCustomization() {
    hideAllScreens();
    document.getElementById('mascotCustomizationScreen').classList.add('active');
    gameState.currentScreen = 'mascotCustomization';
    loadMascotCustomization();
    applyMascotCustomization('mobile');
    updateMascotMessage('¡Hagamos que tu avatar sea único! Puedes cambiar colores, ojos, boca y más.');
}

// Funciones para la nueva interfaz de personalización
function switchTab(tabName) {
    // Remover active de todas las tabs
    document.querySelectorAll('.tab-modern').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos los paneles
    document.querySelectorAll('.customization-panel-modern').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Activar la tab seleccionada
    event.target.classList.add('active');
    
    // Activar el panel correspondiente
    const panelMap = {
        'pelaje': 'pelajePanel',
        'ojos': 'ojosPanel',
        'boca': 'bocaPanel',
        'nariz': 'narizPanel',
        'accesorios': 'accesoriosPanel'
    };
    
    const panelId = panelMap[tabName];
    if (panelId) {
        document.getElementById(panelId).classList.add('active');
    }
}

function changeBodyColor(color) {
    mascotCustomization.bodyColor = color;
    applyMascotCustomization('preview');
    
    // Actualizar selección visual
    document.querySelectorAll('#pelajePanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');
    
    updateMascotMessage('¡Me gusta este color! ¡Se ve genial!');
}

function changeEyeStyle(style) {
    mascotCustomization.eyeStyle = style;
    applyMascotCustomization('preview');
    
    // Actualizar selección visual
    document.querySelectorAll('#ojosPanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');
    
    const messages = {
        'normal': '¡Unos ojos clásicos!',
        'large': '¡Qué ojos tan grandes y expresivos!',
        'sleepy': '¡Aww, parezco tener sueño!',
        'happy': '¡Me veo muy feliz así!',
        'star': '¡Tengo estrellas en los ojos!',
        'heart': '¡Ojos llenos de amor!',
        'rainbow': '¡Qué colorido me veo!',
        'cool': '¡Me veo súper genial!'
    };
    
    updateMascotMessage(messages[style] || '¡Me encanta este estilo!');
}

function changeMouthStyle(style) {
    mascotCustomization.mouthStyle = style;
    applyMascotCustomization('preview');
    
    // Actualizar selección visual
    document.querySelectorAll('#bocaPanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');
    
    const messages = {
        'happy': '¡Una sonrisa hermosa!',
        'neutral': 'Expresión serena y calmada.',
        'surprised': '¡Qué sorpresa tan grande!',
        'playful': '¡Me siento juguetón!',
        'laugh': '¡Jajaja, me da mucha risa!',
        'cute': '¡Aww, qué adorable me veo!'
    };
    
    updateMascotMessage(messages[style] || '¡Me gusta esta expresión!');
}

function changeNoseStyle(style) {
    mascotCustomization.noseStyle = style;
    applyMascotCustomization('preview');
    
    // Actualizar selección visual
    document.querySelectorAll('#narizPanel .option-card').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');
    
    const messages = {
        'normal': '¡Una nariz perfecta!',
        'small': '¡Qué tierna naricita!',
        'big': '¡Una nariz prominente y distinguida!',
        'button': '¡Como un botoncito!',
        'heart': '¡Una nariz llena de amor!'
    };
    
    updateMascotMessage(messages[style] || '¡Esta nariz me queda genial!');
}

function toggleAccessory(accessory) {
    mascotCustomization.accessories[accessory] = !mascotCustomization.accessories[accessory];
    applyMascotCustomization('preview');
    
    // Actualizar selección visual
    const button = event.target.closest('.option-card');
    button.classList.toggle('selected');
    
    const messages = {
        'hat': mascotCustomization.accessories[accessory] ? '¡Un sombrero elegante!' : 'Sin sombrero, más natural.',
        'glasses': mascotCustomization.accessories[accessory] ? '¡Me veo muy intelectual!' : 'Sin lentes, ojos al natural.',
        'cap': mascotCustomization.accessories[accessory] ? '¡Lista para el deporte!' : 'Sin gorra, estilo casual.',
        'headband': mascotCustomization.accessories[accessory] ? '¡Como toda una princesa!' : 'Sin diadema, estilo simple.',
        'earrings': mascotCustomization.accessories[accessory] ? '¡Brillando con estilo!' : 'Sin aretes, look natural.',
        'bowtie': mascotCustomization.accessories[accessory] ? '¡Muy elegante y formal!' : 'Sin corbatín, más relajado.',
        'chain': mascotCustomization.accessories[accessory] ? '¡Bling bling!' : 'Sin cadena, estilo minimalista.',
        'scarf': mascotCustomization.accessories[accessory] ? '¡Abrigadito y fashionable!' : 'Sin bufanda, más fresco.'
    };
    
    updateMascotMessage(messages[accessory] || '¡Cambio de look!');
}

function resetCustomization() {
    // Resetear a valores por defecto
    mascotCustomization.bodyColor = '#D2691E';
    mascotCustomization.eyeStyle = 'normal';
    mascotCustomization.mouthStyle = 'happy';
    mascotCustomization.noseStyle = 'normal';
    
    // Resetear accesorios
    Object.keys(mascotCustomization.accessories).forEach(accessory => {
        mascotCustomization.accessories[accessory] = false;
    });
    
    // Aplicar cambios
    applyMascotCustomization('preview');
    
    // Actualizar selecciones visuales
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Marcar opciones por defecto como seleccionadas
    document.querySelector('[data-color="#D2691E"]')?.classList.add('selected');
    document.querySelector('#ojosPanel .option-card')?.classList.add('selected');
    document.querySelector('#bocaPanel .option-card')?.classList.add('selected');
    document.querySelector('#narizPanel .option-card')?.classList.add('selected');
    
    updateMascotMessage('¡He vuelto a mi aspecto original!');
}

function showSettings() {
    hideAllScreens();
    document.getElementById('settingsScreen').classList.add('active');
    gameState.currentScreen = 'settings';
    loadSettings();
    updateMascotMessage('Aquí puedes ajustar la aplicación a tu gusto.');
}

// Funciones de perfil
function updateProfileData() {
    if (!gameState.user) return;
    
    // Actualizar elementos del header
    const profileNameDisplay = document.getElementById('profileNameDisplay');
    const profileLevelDisplay = document.getElementById('profileLevelDisplay');
    if (profileNameDisplay) profileNameDisplay.textContent = gameState.user.name || 'Usuario';
    if (profileLevelDisplay) profileLevelDisplay.textContent = gameState.user.level || 1;
    
    // Actualizar elementos de información
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAge = document.getElementById('profileAge');
    if (profileName) profileName.textContent = gameState.user.name || 'Usuario';
    if (profileEmail) profileEmail.textContent = gameState.user.email || 'email@ejemplo.com';
    if (profileAge) {
        const ageMap = { 'kid': '6-12 años', 'teen': '13-17 años', 'adult': '18+ años' };
        profileAge.textContent = ageMap[gameState.user.age] || '6-12 años';
    }
    
    // Actualizar estadísticas
    const elements = ['profileStreak', 'profileGems', 'profileLevel'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const property = id.replace('profile', '').toLowerCase();
            element.textContent = gameState.user[property] || 0;
        }
    });
    
    const accuracy = gameState.user.totalQuestions > 0 ? 
        Math.round((gameState.user.totalCorrect / gameState.user.totalQuestions) * 100) : 0;
    const profileAccuracy = document.getElementById('profileAccuracy');
    if (profileAccuracy) profileAccuracy.textContent = accuracy + '%';
    
    updateMascotDisplay();
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

// Funciones de personalización de mascota
function loadMascotCustomization() {
    if (gameState.user && gameState.user.mascotCustomization) {
        Object.assign(mascotCustomization, gameState.user.mascotCustomization);
    }
    applyMascotCustomization('preview');
    
    // Marcar las opciones seleccionadas en la UI
    setTimeout(() => {
        // Marcar color seleccionado
        document.querySelectorAll('.option-card').forEach(card => {
            const colorAttr = card.getAttribute('data-color');
            if (colorAttr === mascotCustomization.bodyColor) {
                card.classList.add('selected');
            }
        });
        
        // Marcar accesorios activos
        Object.keys(mascotCustomization.accessories).forEach(accessory => {
            if (mascotCustomization.accessories[accessory]) {
                const accessoryCard = document.querySelector(`[onclick="toggleAccessory('${accessory}')"]`);
                if (accessoryCard) {
                    accessoryCard.classList.add('selected');
                }
            }
        });
    }, 100);
}

// Las funciones de personalización móvil ya manejan todo

function applyMascotCustomization(target = 'main') {
    let prefixes;
    if (target === 'preview') {
        prefixes = ['preview'];
    } else {
        prefixes = ['', 'Home', 'Lessons', 'Game', 'preview'];
    }
    
    prefixes.forEach(prefix => {
        // Aplicar color del cuerpo
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
        
        // Aplicar estilo de ojos más avanzado
        const eyes = document.querySelectorAll(`#${prefix}BearEyeLeft, #${prefix}BearEyeRight`);
        eyes.forEach((eye, index) => {
            if (!eye) return;
            
            // Resetear estilos
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
                    pupil.style.border = '2px solid #000';
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
                // Para estos estilos especiales no necesitamos pupila tradicional
            } else if (!eye.innerHTML.includes('div') || mascotCustomization.eyeStyle === 'normal') {
                eye.innerHTML = '';
                eye.appendChild(pupil);
            }
        });
        
        // Aplicar estilo de nariz
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
        
        // Aplicar estilo de boca avanzado
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
                default: // happy
                    mouth.style.borderRadius = '0 0 35px 35px';
                    mouth.style.width = '35px';
                    mouth.style.height = '18px';
                    mouth.style.border = '4px solid #2c2c2c';
                    mouth.style.borderTop = 'none';
                    mouth.innerHTML = '';
            }
        }
        
        // Aplicar accesorios
        applyAccessories(prefix);
        
        // Aplicar patrones
        applyPatterns(prefix);
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
    // Limpiar accesorios existentes
    const existingAccessories = document.querySelectorAll(`[id*="${prefix}Accessory"]`);
    existingAccessories.forEach(acc => acc.remove());
    
    const bearHead = document.getElementById(`${prefix}BearHead`) || 
                     document.querySelector(`#bear${prefix} .bear-head`);
    const bearBody = document.getElementById(`${prefix}BearBody`) || 
                     document.querySelector(`#bear${prefix} .bear-body`);
    
    if (!bearHead) return;
    
    // Lentes
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
        
        // Agregar puente de lentes
        glasses.innerHTML = `
            <div style="position: absolute; top: 8px; left: 32px; width: 6px; height: 3px; background: #333; border-radius: 2px;"></div>
            <div style="position: absolute; top: -3px; left: 45px; width: 20px; height: 20px; border: 3px solid #333; border-radius: 50%; background: rgba(0,100,200,0.3);"></div>
        `;
        bearHead.appendChild(glasses);
    }
    
    // Sombrero
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
    
    // Gorra
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
    
    // Diadema
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
    
    // Aretes
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
    
    // Corbatín
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
    
    // Cadena
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
    
    // Bufanda
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

function applyPatterns(prefix) {
    const bearHead = document.getElementById(`${prefix}BearHead`) || 
                     document.querySelector(`#bear${prefix} .bear-head`);
    const bearBody = document.getElementById(`${prefix}BearBody`) || 
                     document.querySelector(`#bear${prefix} .bear-body`);
    
    if (!bearHead || !bearBody) return;
    
    // Limpiar patrones existentes
    const existingPatterns = document.querySelectorAll(`[id*="${prefix}Pattern"]`);
    existingPatterns.forEach(pattern => pattern.remove());
    
    // Manchas
    if (mascotCustomization.patterns.spots) {
        [bearHead, bearBody].forEach((part, index) => {
            const spots = document.createElement('div');
            spots.id = `${prefix}PatternSpots${index}`;
            spots.style.position = 'absolute';
            spots.style.top = '0';
            spots.style.left = '0';
            spots.style.width = '100%';
            spots.style.height = '100%';
            spots.style.borderRadius = part === bearHead ? '50%' : '60px 60px 35px 35px';
            spots.style.background = `
                radial-gradient(circle at 30% 30%, ${darkenColor(mascotCustomization.bodyColor, 30)} 8px, transparent 8px),
                radial-gradient(circle at 70% 60%, ${darkenColor(mascotCustomization.bodyColor, 30)} 6px, transparent 6px),
                radial-gradient(circle at 50% 80%, ${darkenColor(mascotCustomization.bodyColor, 30)} 7px, transparent 7px)
            `;
            spots.style.zIndex = '2';
            part.appendChild(spots);
        });
    }
    
    // Rayas
    if (mascotCustomization.patterns.stripes) {
        [bearHead, bearBody].forEach((part, index) => {
            const stripes = document.createElement('div');
            stripes.id = `${prefix}PatternStripes${index}`;
            stripes.style.position = 'absolute';
            stripes.style.top = '0';
            stripes.style.left = '0';
            stripes.style.width = '100%';
            stripes.style.height = '100%';
            stripes.style.borderRadius = part === bearHead ? '50%' : '60px 60px 35px 35px';
            stripes.style.background = `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                ${darkenColor(mascotCustomization.bodyColor, 25)} 10px,
                ${darkenColor(mascotCustomization.bodyColor, 25)} 15px
            )`;
            stripes.style.zIndex = '2';
            part.appendChild(stripes);
        });
    }
}

function saveMascotCustomization() {
    gameState.user.mascotCustomization = { ...mascotCustomization };
    saveUserProgress();
    updateMascotDisplay();
    showProfile();
    updateMascotMessage('¡Tu mascota ha sido personalizada! ¡Se ve increíble!');
}

function updateMascotDisplay() {
    // Aplicar a todas las instancias de la mascota
    applyMascotCustomization('main');
    
    // Asegurar que se aplique a todas las pantallas
    setTimeout(() => {
        applyMascotCustomization('main');
    }, 100);
}

// Funciones de configuraciones
function loadSettings() {
    if (gameState.user && gameState.user.settings) {
        Object.assign(appSettings, gameState.user.settings);
    }
    
    document.getElementById('languageSelect').value = appSettings.language;
    document.getElementById('soundEffects').checked = appSettings.soundEffects;
    document.getElementById('backgroundMusic').checked = appSettings.backgroundMusic;
    document.getElementById('volumeSlider').value = appSettings.volume;
    document.getElementById('volumeValue').textContent = appSettings.volume + '%';
    document.getElementById('adaptiveDifficulty').checked = appSettings.adaptiveDifficulty;
    document.getElementById('dailyReminders').checked = appSettings.dailyReminders;
    document.getElementById('vibration').checked = appSettings.vibration;
    document.getElementById('shareProgress').checked = appSettings.shareProgress;
    document.getElementById('errorAnalysis').checked = appSettings.errorAnalysis;
}

function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    appSettings.language = language;
    saveSettings();
    
    // Aquí implementarías la lógica de cambio de idioma
    updateMascotMessage(language === 'es' ? '¡Idioma cambiado a español!' : 'Language changed to ' + language + '!');
}

function toggleSoundEffects() {
    appSettings.soundEffects = document.getElementById('soundEffects').checked;
    saveSettings();
    updateMascotMessage(appSettings.soundEffects ? '¡Efectos de sonido activados!' : 'Efectos de sonido desactivados');
}

function toggleBackgroundMusic() {
    appSettings.backgroundMusic = document.getElementById('backgroundMusic').checked;
    saveSettings();
    updateMascotMessage(appSettings.backgroundMusic ? '¡Música de fondo activada!' : 'Música de fondo desactivada');
}

function changeVolume() {
    const volume = document.getElementById('volumeSlider').value;
    appSettings.volume = volume;
    document.getElementById('volumeValue').textContent = volume + '%';
    saveSettings();
}

function toggleAdaptiveDifficulty() {
    appSettings.adaptiveDifficulty = document.getElementById('adaptiveDifficulty').checked;
    saveSettings();
    updateMascotMessage(appSettings.adaptiveDifficulty ? 
        'Dificultad automática activada. Ajustaré los problemas a tu nivel.' : 
        'Dificultad automática desactivada.');
}

function toggleDailyReminders() {
    appSettings.dailyReminders = document.getElementById('dailyReminders').checked;
    saveSettings();
    updateMascotMessage(appSettings.dailyReminders ? 
        'Te recordaré practicar matemáticas cada día.' : 
        'Recordatorios diarios desactivados.');
}

function toggleVibration() {
    appSettings.vibration = document.getElementById('vibration').checked;
    saveSettings();
    updateMascotMessage('Configuración de vibración actualizada.');
}

function toggleShareProgress() {
    appSettings.shareProgress = document.getElementById('shareProgress').checked;
    saveSettings();
    updateMascotMessage(appSettings.shareProgress ? 
        'Tu progreso podrá ser compartido.' : 
        'Tu progreso se mantendrá privado.');
}

function toggleErrorAnalysis() {
    appSettings.errorAnalysis = document.getElementById('errorAnalysis').checked;
    saveSettings();
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
