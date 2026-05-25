const translations = {
  en: {
    // Navbar
    dashboard: 'Dashboard',
    clients: 'Clients',
    cases: 'Cases',
    settings: 'Settings',
    logout: 'Logout',

    // Login
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    email: 'Email',
    password: 'Password',
    emailRequired: 'Email is required',
    emailInvalid: 'Valid email is required',
    passwordRequired: 'Password must be at least 6 characters',
    serverError: 'Server error. Please try again.',
    demo: 'Demo: david@legaltrack.com / 123456',
    signInToAccount: 'Sign in to your account',

    // Dashboard
    welcomeBack: 'Welcome back',
    dashboardSubtitle: "Here's an overview of your cases and clients.",
    totalCases: 'Total Cases',
    openCases: 'Open Cases',
    pendingCases: 'Pending Cases',
    totalClients: 'Total Clients',
    recentCases: 'Recent Cases',
    allCases: 'All Cases',
    loadingError: 'Failed to load data. Is the backend running?',
    loading: 'Loading...',

    // Cases Page
    addCase: '+ Add Case',
    casesOverview: 'Cases Overview',
    casesTable: 'Cases Table',
    all: 'All',
    open: 'Open',
    pending: 'Pending',
    closed: 'Closed',
    addNewCase: 'Add New Case',
    client: 'Client',
    selectClient: 'Select a client',
    type: 'Type',
    selectType: 'Select a type',
    description: 'Description',
    descriptionPlaceholder: 'Brief description of the case',
    allFieldsRequired: 'All fields are required.',
    cancel: 'Cancel',
    opened: 'Opened',
    status: 'Status',
    id: 'ID',
    clientId: 'Client ID',

    // Clients Page
    addClient: '+ Add Client',
    allClients: 'All Clients',
    clientsTable: 'Clients Table',
    addNewClient: 'Add New Client',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    namePhoneEmailRequired: 'Name, phone and email are required.',
    noAddress: 'No address provided',

    // Settings
    username: 'Username',
    theme: 'Theme',
    language: 'Language',
    enableNotifications: 'Enable Notifications',
    saveSettings: 'Save Settings',
    saving: 'Saving...',
    settingsSaved: 'Settings saved successfully!',
    usernameRequired: 'Username is required',
    validEmailRequired: 'Valid email is required',
    themeRequired: 'Theme is required',
    light: 'Light',
    dark: 'Dark',
    english: 'English',
    hebrew: 'Hebrew',
    failedLoadSettings: 'Failed to load settings.',
    failedSaveSettings: 'Failed to save settings.',

    // Footer
    footerSlogan: 'AI-Powered Case Management for Lawyers',
    allRightsReserved: 'All rights reserved.',

    // Table
    noDataFound: 'No data found.',
    noCasesFound: 'No cases found.',
    noClientsFound: 'No clients found.',

    // Direction
    dir: 'ltr'
  },

  he: {
    // Navbar
    dashboard: 'דף בית',
    clients: 'לקוחות',
    cases: 'תיקים',
    settings: 'הגדרות',
    logout: 'התנתק',

    // Login
    signIn: 'כניסה',
    signingIn: 'מתחבר...',
    email: 'אימייל',
    password: 'סיסמה',
    emailRequired: 'נדרש אימייל',
    emailInvalid: 'נדרש אימייל תקין',
    passwordRequired: 'הסיסמה חייבת להכיל לפחות 6 תווים',
    serverError: 'שגיאת שרת. נסה שוב.',
    demo: 'דמו: david@legaltrack.com / 123456',
    signInToAccount: 'כניסה לחשבון',

    // Dashboard
    welcomeBack: 'ברוך הבא',
    dashboardSubtitle: 'סקירה כללית של התיקים והלקוחות שלך.',
    totalCases: 'סה"כ תיקים',
    openCases: 'תיקים פתוחים',
    pendingCases: 'תיקים בהמתנה',
    totalClients: 'סה"כ לקוחות',
    recentCases: 'תיקים אחרונים',
    allCases: 'כל התיקים',
    loadingError: 'טעינת הנתונים נכשלה. האם הבקאנד פועל?',
    loading: 'טוען...',

    // Cases Page
    addCase: '+ הוסף תיק',
    casesOverview: 'סקירת תיקים',
    casesTable: 'טבלת תיקים',
    all: 'הכל',
    open: 'פתוח',
    pending: 'בהמתנה',
    closed: 'סגור',
    addNewCase: 'הוסף תיק חדש',
    client: 'לקוח',
    selectClient: 'בחר לקוח',
    type: 'סוג',
    selectType: 'בחר סוג',
    description: 'תיאור',
    descriptionPlaceholder: 'תיאור קצר של התיק',
    allFieldsRequired: 'כל השדות הם חובה.',
    cancel: 'ביטול',
    opened: 'זמן פתיחה',
    status: 'סטטוס',
    id: 'מזהה',
    clientId: 'מזהה לקוח',

    // Clients Page
    addClient: '+ הוסף לקוח',
    allClients: 'כל הלקוחות',
    clientsTable: 'טבלת לקוחות',
    addNewClient: 'הוסף לקוח חדש',
    name: 'שם',
    phone: 'טלפון',
    address: 'כתובת',
    namePhoneEmailRequired: 'שם, טלפון ואימייל הם חובה.',
    noAddress: 'לא צוינה כתובת',

    // Settings
    username: 'שם משתמש',
    theme: 'ערכת נושא',
    language: 'שפה',
    enableNotifications: 'הפעל התראות',
    saveSettings: 'שמור הגדרות',
    saving: 'שומר...',
    settingsSaved: 'ההגדרות נשמרו בהצלחה!',
    usernameRequired: 'נדרש שם משתמש',
    validEmailRequired: 'נדרש אימייל תקין',
    themeRequired: 'נדרשת ערכת נושא',
    light: 'בהיר',
    dark: 'כהה',
    english: 'אנגלית',
    hebrew: 'עברית',
    failedLoadSettings: 'טעינת ההגדרות נכשלה.',
    failedSaveSettings: 'שמירת ההגדרות נכשלה.',

    // Footer
    footerSlogan: 'ניהול תיקים משפטיים מבוסס בינה מלאכותית',
    allRightsReserved: 'כל הזכויות שמורות.',

    // Table
    noDataFound: 'לא נמצאו נתונים.',
    noCasesFound: 'לא נמצאו תיקים.',
    noClientsFound: 'לא נמצאו לקוחות.',

    // Direction
    dir: 'rtl'
  }
};

export default translations;