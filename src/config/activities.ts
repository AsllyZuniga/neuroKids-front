
export interface ActivityConfig {
    id: string;
    dbId: number;
    type: 'lectura' | 'juego';
    title: string;
    icon: string;
    component: string;
    ageGroup: '7-8' | '9-10' | '11-12';
    maxScore: number;
    level: number;
    route: string;
}

export const ACTIVITIES_CONFIG: ActivityConfig[] = [

    // Edad 7-8
    {
        id: 'cuento-pictogramas',
        dbId: 1,
        type: 'lectura',
        title: 'Cuento con Pictogramas',
        icon: '📚',
        component: 'CuentoPictogramas',
        ageGroup: '7-8',
        maxScore: 150,
        level: 1,
        route: '/nivel1/lectura1'
    },
    {
        id: 'frases-magicas',
        dbId: 2,
        type: 'lectura',
        title: 'Frases Mágicas',
        icon: '✨',
        component: 'FrasesMagicas',
        ageGroup: '7-8',
        maxScore: 100,
        level: 1,
        route: '/nivel1/lectura2'
    },
    {
        id: 'primera-palabra',
        dbId: 3,
        type: 'lectura',
        title: 'Mi Primera Palabra',
        icon: '📖',
        component: 'PrimeraPalabra',
        ageGroup: '7-8',
        maxScore: 90,
        level: 1,
        route: '/nivel1/lectura3'
    },

    // Edad 9-10
    {
        id: 'historias-interactivas',
        dbId: 4,
        type: 'lectura',
        title: 'Historias Interactivas',
        icon: '🎭',
        component: 'HistoriasInteractivas',
        ageGroup: '9-10',
        maxScore: 200,
        level: 2,
        route: '/nivel2/lectura1'
    },
    {
        id: 'mini-aventuras',
        dbId: 5,
        type: 'lectura',
        title: 'Mini Aventuras',
        icon: '🗺️',
        component: 'MiniAventuras',
        ageGroup: '9-10',
        maxScore: 160,
        level: 1,
        route: '/nivel2/lectura2'
    },
    {
        id: 'revista-infantil',
        dbId: 6,
        type: 'lectura',
        title: 'Revista Infantil',
        icon: '📰',
        component: 'RevistaInfantil',
        ageGroup: '9-10',
        maxScore: 120,
        level: 1,
        route: '/nivel2/lectura3'
    },

    // Edad 11-12
    {
        id: 'biografias-sencillas',
        dbId: 7,
        type: 'lectura',
        title: 'Biografías Sencillas',
        icon: '👤',
        component: 'BiografiasSencillas',
        ageGroup: '11-12',
        maxScore: 160,
        level: 2,
        route: '/nivel3/lectura1'
    },
    {
        id: 'cuento-interactivo',
        dbId: 8,
        type: 'lectura',
        title: 'Cuento Interactivo',
        icon: '📕',
        component: 'CuentoInteractivo',
        ageGroup: '11-12',
        maxScore: 200,
        level: 2,
        route: '/nivel3/lectura2'
    },
    {
        id: 'noticias-sencillas',
        dbId: 9,
        type: 'lectura',
        title: 'Noticias Sencillas',
        icon: '📰',
        component: 'NoticiasSencillas',
        ageGroup: '11-12',
        maxScore: 140,
        level: 1,
        route: '/nivel3/lectura3'
    },


    // Edad 7-8
    {
        id: 'bingo-palabras',
        dbId: 10,
        type: 'juego',
        title: 'Bingo de Palabras',
        icon: '🎮',
        component: 'BingoPalabras',
        ageGroup: '7-8',
        maxScore: 100,
        level: 1,
        route: '/nivel1/juego1'
    },
    {
        id: 'caza-silaba',
        dbId: 11,
        type: 'juego',
        title: 'Caza la Sílaba',
        icon: '🎯',
        component: 'CazaSilaba',
        ageGroup: '7-8',
        maxScore: 120,
        level: 1,
        route: '/nivel1/juego2'
    },
    {
        id: 'escucha-elige',
        dbId: 12,
        type: 'juego',
        title: 'Escucha y Elige',
        icon: '🎧',
        component: 'EscuchaElige',
        ageGroup: '7-8',
        maxScore: 80,
        level: 1,
        route: '/nivel1/juego3'
    },

    // Edad 9-10
    {
        id: 'construye-frase',
        dbId: 13,
        type: 'juego',
        title: 'Construye la Frase',
        icon: '🔨',
        component: 'ConstruyeFrase',
        ageGroup: '9-10',
        maxScore: 120,
        level: 1,
        route: '/nivel2/juego1'
    },
    {
        id: 'laberinto-lector',
        dbId: 14,
        type: 'juego',
        title: 'Laberinto Lector',
        icon: '🌀',
        component: 'LaberintoLector',
        ageGroup: '9-10',
        maxScore: 180,
        level: 2,
        route: '/nivel2/juego2'
    },
    {
        id: 'ordena-historia',
        dbId: 15,
        type: 'juego',
        title: 'Ordena la Historia',
        icon: '🧩',
        component: 'OrdenaHistoria',
        ageGroup: '9-10',
        maxScore: 140,
        level: 1,
        route: '/nivel2/juego3'
    },

    // Edad 11-12
    {
        id: 'cohete-lector',
        dbId: 16,
        type: 'juego',
        title: 'Cohete Lector',
        icon: '🚀',
        component: 'CoheteLector',
        ageGroup: '11-12',
        maxScore: 200,
        level: 2,
        route: '/nivel3/juego1'
    },
    {
        id: 'detective-palabras',
        dbId: 17,
        type: 'juego',
        title: 'Detective de Palabras',
        icon: '🔍',
        component: 'DetectivePalabras',
        ageGroup: '11-12',
        maxScore: 250,
        level: 3,
        route: '/nivel3/juego2'
    },
    {
        id: 'preguntas-inferenciales',
        dbId: 18,
        type: 'juego',
        title: 'Preguntas Inferenciales',
        icon: '💡',
        component: 'PreguntasInferenciales',
        ageGroup: '11-12',
        maxScore: 180,
        level: 3,
        route: '/nivel3/juego3'
    }
];

export function getActivityByFrontendId(id: string): ActivityConfig | undefined {
    return ACTIVITIES_CONFIG.find(activity => activity.id === id);
}

export function getActivityByDbId(dbId: number | string): ActivityConfig | undefined {
    const n = Number(dbId);
    if (Number.isNaN(n)) return undefined;
    return ACTIVITIES_CONFIG.find((activity) => activity.dbId === n);
}

export function getActivityByRoute(route: string): ActivityConfig | undefined {
    const normalized = (route || "").trim();
    return ACTIVITIES_CONFIG.find((activity) => (activity.route || "").trim() === normalized);
}


export function getActivitiesByAgeGroup(ageGroup: '7-8' | '9-10' | '11-12'): ActivityConfig[] {
    return ACTIVITIES_CONFIG.filter(activity => activity.ageGroup === ageGroup);
}


export function getActivitiesByType(type: 'lectura' | 'juego'): ActivityConfig[] {
    return ACTIVITIES_CONFIG.filter(activity => activity.type === type);
}


export function getRouteMap(): Record<string, string> {
    return ACTIVITIES_CONFIG.reduce((acc, activity) => {
        acc[activity.id] = activity.route;
        return acc;
    }, {} as Record<string, string>);
}


export function getDbIdMap(): Record<string, number> {
    return ACTIVITIES_CONFIG.reduce((acc, activity) => {
        acc[activity.id] = activity.dbId;
        return acc;
    }, {} as Record<string, number>);
}