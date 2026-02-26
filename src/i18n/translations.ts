export type Lang = 'en' | 'es'

export const translations = {
  en: {
    // Header
    appTitle: 'Voice Changer',
    appSubtitle: 'STEM Audio Demo',
    privacyFirst: '🔒 Privacy-First',

    // Browser not supported
    browserNotSupported: 'Browser Not Supported',
    browserMessage: 'This Voice Changer requires a modern browser with Web Audio API support.',
    pleaseUseOne: 'Please use one of:',

    // Recording
    recordHeading: '🎤 Record Your Voice',
    inputLevel: 'Input Level',
    record: 'Record',
    starting: 'Starting...',
    stop: 'Stop',
    pause: '⏸ Pause',
    resume: '▶ Resume',
    deleteRecording: '🗑 Delete',
    microphone: 'Microphone:',
    secondsLeft: (n: number) => `${n}s left`,
    ofSeconds: (n: number) => `/ ${n}s`,

    // Effects
    effectsHeading: '🎨 Choose an Effect',
    recordHint: 'Record your voice or load a sample to try effects!',
    adjustEffect: (name: string) => `Adjust ${name}`,
    processing: 'Processing...',

    // Playback
    playbackHeading: '▶ Playback',
    original: 'Original',
    stopPlayback: '⏹ Stop',
    downloadWav: '⬇ Download WAV',
    listeningOriginal: '📢 Listening to: Original',
    listeningTo: (name: string) => `📢 Listening to: ${name}`,
    playOriginal: 'Play original recording',
    stopOriginal: 'Stop original',
    playEffect: (name: string) => `Play ${name} effect`,
    stopEffect: (name: string) => `Stop ${name}`,

    // Educational panel
    learnHow: (name: string) => `Learn: How does ${name} work?`,
    whatDoesItDo: 'What does it do?',
    stemConnection: '🔬 STEM Connection',
    didYouKnow: '💡 Did You Know?',

    // Demo samples
    tryDemo: '🎵 Try a demo sample (no microphone needed)',
    demoDescription: 'Choose a pre-made audio sample to experiment with effects without recording:',
    useThis: 'Use This →',
    samples: [
      {
        id: 'sample-sine',
        name: 'Demo Voice (Samantha)',
        description: 'US English female — try Robot, Echo, or Telephone',
      },
      {
        id: 'sample-sweep',
        name: 'British Voice (Daniel)',
        description: 'British English male — try Chipmunk to hear a squeaky accent!',
      },
      {
        id: 'sample-voice',
        name: 'Irish Voice (Moira)',
        description: 'Irish English female — Deep Voice sounds dramatic, Alien sounds wild',
      },
    ],

    // Privacy notice
    privacyStrong: 'Your audio stays on your device.',
    privacySubtext: 'Nothing is uploaded or stored remotely.',
    dismissPrivacy: 'Dismiss privacy notice',

    // Footer
    footerText: 'Built for STEM education • Open source •',
    learnWebAudio: 'Learn about Web Audio',
    by: 'By',
    viewOnGitHub: 'View on GitHub',

    // Skip link
    skipToMain: 'Skip to main content',
  },

  es: {
    // Header
    appTitle: 'Cambiador de Voz',
    appSubtitle: 'Demo STEM de Audio',
    privacyFirst: '🔒 Privacidad Primero',

    // Browser not supported
    browserNotSupported: 'Navegador No Compatible',
    browserMessage:
      'Este Cambiador de Voz requiere un navegador moderno con soporte para Web Audio API.',
    pleaseUseOne: 'Por favor usa uno de:',

    // Recording
    recordHeading: '🎤 Graba Tu Voz',
    inputLevel: 'Nivel de Entrada',
    record: 'Grabar',
    starting: 'Iniciando...',
    stop: 'Detener',
    pause: '⏸ Pausar',
    resume: '▶ Continuar',
    deleteRecording: '🗑 Eliminar',
    microphone: 'Micrófono:',
    secondsLeft: (n: number) => `${n}s restantes`,
    ofSeconds: (n: number) => `/ ${n}s`,

    // Effects
    effectsHeading: '🎨 Elige un Efecto',
    recordHint: '¡Graba tu voz o carga una muestra para probar efectos!',
    adjustEffect: (name: string) => `Ajustar ${name}`,
    processing: 'Procesando...',

    // Playback
    playbackHeading: '▶ Reproducción',
    original: 'Original',
    stopPlayback: '⏹ Detener',
    downloadWav: '⬇ Descargar WAV',
    listeningOriginal: '📢 Escuchando: Original',
    listeningTo: (name: string) => `📢 Escuchando: ${name}`,
    playOriginal: 'Reproducir grabación original',
    stopOriginal: 'Detener original',
    playEffect: (name: string) => `Reproducir efecto ${name}`,
    stopEffect: (name: string) => `Detener ${name}`,

    // Educational panel
    learnHow: (name: string) => `Aprende: ¿Cómo funciona ${name}?`,
    whatDoesItDo: '¿Qué hace?',
    stemConnection: '🔬 Conexión STEM',
    didYouKnow: '💡 ¿Sabías que?',

    // Demo samples
    tryDemo: '🎵 Prueba una muestra de demostración (sin micrófono)',
    demoDescription: 'Elige una muestra de audio para experimentar con efectos sin grabar:',
    useThis: 'Usar Esta →',
    samples: [
      {
        id: 'sample-sine',
        name: 'Voz Demo (Samantha)',
        description: 'Inglés americano femenino — prueba Robot, Eco o Teléfono',
      },
      {
        id: 'sample-sweep',
        name: 'Voz Británica (Daniel)',
        description: 'Inglés británico masculino — ¡prueba Ardilla para un acento gracioso!',
      },
      {
        id: 'sample-voice',
        name: 'Voz Irlandesa (Moira)',
        description: 'Inglés irlandés femenino — Voz Profunda suena dramática, Alienígena suena salvaje',
      },
    ],

    // Privacy notice
    privacyStrong: 'Tu audio permanece en tu dispositivo.',
    privacySubtext: 'Nada se sube ni almacena remotamente.',
    dismissPrivacy: 'Cerrar aviso de privacidad',

    // Footer
    footerText: 'Creado para educación STEM • Código abierto •',
    learnWebAudio: 'Aprende sobre Web Audio',
    by: 'Por',
    viewOnGitHub: 'Ver en GitHub',

    // Skip link
    skipToMain: 'Ir al contenido principal',
  },
} as const
