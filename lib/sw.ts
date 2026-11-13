/**
 * The Kiswahili wording for the learner side of the site.
 *
 * How it works: components/Language.tsx reads the page and swaps any
 * English phrase it finds here for the Kiswahili one. A phrase that isn't
 * listed simply stays in English, so nothing breaks if one is missing.
 *
 * To correct a translation: change the text on the RIGHT of the colon.
 * To add one: copy the English exactly as it appears on the page (left),
 * and write the Kiswahili (right).
 *
 * Not translated on purpose: the admin area, the Privacy Policy and Terms
 * (legal text), names such as "KWCF LMS", and anything an admin typed in
 * (course titles, lesson notes, quiz questions).
 *
 * These are a first draft and should be read by a fluent speaker.
 */

const PHRASES: Record<string, string> = {
  // ---- Top bar, menus and buttons used everywhere ----
  Home: "Nyumbani",
  Courses: "Kozi",
  About: "Kuhusu",
  "About Us": "Kuhusu Sisi",
  "All Courses": "Kozi Zote",
  Resources: "Rasilimali",
  Pricing: "Bei",
  Profile: "Wasifu",
  "My Profile": "Wasifu Wangu",
  "My Learning": "Masomo Yangu",
  Dashboard: "Dashibodi",
  Login: "Ingia",
  "Log in": "Ingia",
  Logout: "Toka",
  "Log out": "Toka",
  "Logging Out...": "Unatoka...",
  Register: "Jisajili",
  "Get Started": "Anza Sasa",
  "Learn More": "Jifunze Zaidi",
  "Enroll Now": "Jiandikishe Sasa",
  "Signed in as": "Umeingia kama",
  "Open menu": "Fungua menyu",
  "Close menu": "Funga menyu",
  "Quick navigation": "Urambazaji wa haraka",
  "Skip to content": "Ruka hadi kwenye maudhui",
  "Loading…": "Inapakia…",
  "Dismiss message": "Ondoa ujumbe",
  Cancel: "Ghairi",
  Continue: "Endelea",
  Start: "Anza",
  Preview: "Onyesho",
  Previous: "Lililotangulia",
  Skip: "Ruka",
  Print: "Chapisha",
  Verify: "Thibitisha",
  Review: "Pitia",
  Email: "Barua pepe",
  Password: "Nenosiri",
  Status: "Hali",
  "Not available": "Haipatikani",
  "Back to Home": "Rudi Nyumbani",
  "Back to Courses": "Rudi kwenye Kozi",
  "Back to Course": "Rudi kwenye Kozi",
  "Back to Login": "Rudi kwenye Kuingia",
  "Back to Pricing": "Rudi kwenye Bei",
  "Browse Courses": "Tazama Kozi",
  "Browse courses": "Tazama kozi",
  "View Profile": "Tazama Wasifu",
  "View My Profile": "Tazama Wasifu Wangu",
  "Go to Learner Profile": "Nenda kwenye Wasifu wa Mwanafunzi",
  "Go to My Learning": "Nenda kwenye Masomo Yangu",
  "Go to the homepage": "Nenda kwenye ukurasa wa mwanzo",
  "Try again": "Jaribu tena",

  // ---- Low-data mode ----
  "Low-data mode:": "Hali ya data kidogo:",
  On: "Imewashwa",
  Off: "Imezimwa",
  "Low-data mode is on": "Hali ya data kidogo imewashwa",
  "The video isn't loaded yet, to save your data. The lesson notes below are ready to read.":
    "Video bado haijapakiwa, ili kuokoa data yako. Maelezo ya somo hapa chini yako tayari kusomwa.",
  "Load the video": "Pakia video",
  "Turn off low-data mode": "Zima hali ya data kidogo",
  "Low-data mode: videos wait for a tap, and large photos are skipped":
    "Hali ya data kidogo: video husubiri ubonyeze, na picha kubwa hazipakiwi",

  // ---- Footer ----
  "Empowering wildlife conservation through education and community engagement across Kenya's conservancies.":
    "Kuwezesha uhifadhi wa wanyamapori kupitia elimu na ushirikishwaji wa jamii katika hifadhi za jamii kote Kenya.",
  Platform: "Jukwaa",
  Organisation: "Shirika",
  Partners: "Washirika",
  "Annual Reports": "Ripoti za Mwaka",
  Mobile: "Simu ya mkononi",
  Landline: "Simu ya mezani",
  "Privacy Policy": "Sera ya Faragha",
  "Terms and Conditions": "Vigezo na Masharti",
  "Kenya Wildlife Conservancies Association. All rights reserved.":
    "Kenya Wildlife Conservancies Association. Haki zote zimehifadhiwa.",

  // ---- Homepage ----
  "Empowering wildlife conservation leaders with expert led training in conservancy management, governance, and sustainable development.":
    "Tunawawezesha viongozi wa uhifadhi wa wanyamapori kwa mafunzo yanayoongozwa na wataalamu kuhusu usimamizi wa hifadhi, utawala na maendeleo endelevu.",
  "Read the Brochure": "Soma Kijitabu",
  "Download Brochure": "Pakua Kijitabu",
  "Scroll to About": "Shuka hadi Kuhusu",
  "Topics covered": "Mada zinazofundishwa",
  "Learning Modules": "Moduli za Mafunzo",
  "Conservancies in Kenya": "Hifadhi nchini Kenya",
  "Our Mission": "Dhamira Yetu",
  "About the Hub": "Kuhusu Jukwaa",
  "Building Stronger": "Kujenga Hifadhi",
  "Conservancies Across Kenya": "Imara Kote Kenya",
  "The Kenya Conservancies Learning Hub is your comprehensive platform for establishing, managing, and growing successful wildlife conservancies that benefit both nature and communities. Hosted by the Kenya Wildlife Conservancies Foundation in partnership with KWCA.":
    "Kenya Conservancies Learning Hub ni jukwaa lako kamili la kuanzisha, kusimamia na kukuza hifadhi za wanyamapori zenye mafanikio, zinazonufaisha mazingira na jamii. Linaendeshwa na Kenya Wildlife Conservancies Foundation kwa ushirikiano na KWCA.",
  "Learn more about KWCF": "Jifunze zaidi kuhusu KWCF",
  "Key Learning": "Mada",
  Topics: "Muhimu",
  "Comprehensive, expert-led modules designed to equip you with the skills to excel in wildlife conservation management.":
    "Moduli kamili zinazoongozwa na wataalamu, zilizoundwa kukupa ujuzi wa kufanikiwa katika usimamizi wa uhifadhi wa wanyamapori.",
  "Start module": "Anza moduli",
  "Self-paced": "Kwa kasi yako",
  "More Modules": "Moduli Zaidi",
  "Coming Soon": "Zinakuja Karibuni",
  "We're expanding the curriculum with new modules, case studies, and resources every quarter.":
    "Tunapanua mtaala kwa moduli mpya, mifano halisi na rasilimali kila robo mwaka.",
  "Explore All Modules": "Tazama Moduli Zote",
  "Why This Platform": "Kwa Nini Jukwaa Hili",
  "Built for Kenya's": "Limeundwa kwa Mazingira",
  "Conservation Landscape": "ya Uhifadhi ya Kenya",
  "Our platform is specifically designed for Kenya's unique conservation context — offering practical, actionable knowledge you can apply directly to your conservancy.":
    "Jukwaa letu limeundwa mahususi kwa muktadha wa kipekee wa uhifadhi nchini Kenya — likitoa maarifa ya vitendo unayoweza kuyatumia moja kwa moja katika hifadhi yako.",
  "Community First": "Jamii Kwanza",
  "World-Class Standards": "Viwango vya Kimataifa",
  "Meet international Greenlisting criteria and build credible carbon projects that position Kenya as a global conservation leader.":
    "Fikia vigezo vya kimataifa vya Green List na ujenge miradi ya kaboni inayoaminika, inayoiweka Kenya kama kiongozi wa uhifadhi duniani.",
  "Expert-Led Content": "Maudhui ya Wataalamu",
  "Interactive Learning": "Kujifunza kwa Vitendo",
  "Video tutorials, case studies, and real-world examples from Kenya's conservancies.":
    "Mafunzo ya video, mifano halisi na uzoefu kutoka hifadhi za Kenya.",
  "Downloadable Resources": "Rasilimali za Kupakua",
  "Templates, guides, and tools ready to implement in your conservancy immediately.":
    "Violezo, miongozo na zana zilizo tayari kutumika katika hifadhi yako mara moja.",
  "Community Network": "Mtandao wa Jamii",
  "Join the Movement": "Jiunge na Harakati",
  "Ready to Transform": "Uko Tayari Kubadilisha",
  "Your Conservancy?": "Hifadhi Yako?",
  "Join hundreds of conservancy leaders across Kenya who are building a sustainable future for wildlife and communities.":
    "Jiunge na mamia ya viongozi wa hifadhi kote Kenya wanaojenga mustakabali endelevu kwa wanyamapori na jamii.",

  // ---- Courses list ----
  "KWCF Learning Courses": "Kozi za Mafunzo za KWCF",
  Explore: "Gundua",
  "Conservation Learning": "Mafunzo ya Uhifadhi",
  "Practical courses designed to support conservancy leaders, managers, board members, and community stakeholders with accessible digital learning.":
    "Kozi za vitendo zilizoundwa kuwasaidia viongozi wa hifadhi, mameneja, wajumbe wa bodi na wadau wa jamii kupitia mafunzo ya kidijitali yanayofikika kwa urahisi.",
  "Published Courses": "Kozi Zilizochapishwa",
  "Total Lessons": "Jumla ya Masomo",
  "Quizzes Available": "Majaribio Yaliyopo",
  "Course Catalogue": "Orodha ya Kozi",
  "Available Courses": "Kozi Zilizopo",
  "Start with free preview lessons, then unlock premium learning through course payment or subscription.":
    "Anza na masomo ya bure ya onyesho, kisha fungua masomo ya premium kwa kulipia kozi au usajili.",
  "No courses available yet": "Bado hakuna kozi",
  "Published courses will appear here once they are added by the KWCF LMS admin team.":
    "Kozi zilizochapishwa zitaonekana hapa zikishaongezwa na wasimamizi wa KWCF LMS.",
  "Learning Pathway": "Njia ya Kujifunza",
  "Build Skills for Stronger Conservancy Management":
    "Jenga Ujuzi kwa Usimamizi Imara wa Hifadhi",
  "The KWCF LMS brings together practical lessons, quizzes, readings, and certificates to help conservation teams strengthen governance, management, and sustainability.":
    "KWCF LMS inaleta pamoja masomo ya vitendo, majaribio, makala ya kusoma na vyeti ili kusaidia timu za uhifadhi kuimarisha utawala, usimamizi na uendelevu.",
  "A practical conservation learning course designed for conservancy teams and community-based conservation leaders.":
    "Kozi ya vitendo ya uhifadhi iliyoundwa kwa timu za hifadhi na viongozi wa uhifadhi wa kijamii.",
  "Free preview": "Onyesho la bure",
  Premium: "Premium",
  "Free lessons": "Masomo ya bure",
  "Premium lessons": "Masomo ya premium",
  "Practice quiz": "Jaribio la mazoezi",
  "Final quiz": "Jaribio la mwisho",
  "This course includes": "Kozi hii ina",
  General: "Jumla",
  "Start here": "Anzia hapa",
  "Start course": "Anza kozi",
  "View course": "Tazama kozi",

  // ---- One course ----
  "Free Preview Available": "Onyesho la Bure Linapatikana",
  "Subscription Access": "Ufikiaji kwa Usajili",
  "Premium Access Required": "Ufikiaji wa Premium Unahitajika",
  "Course not found": "Kozi haikupatikana",
  "This course may not exist or may have been removed.":
    "Huenda kozi hii haipo au imeondolewa.",
  "About this course": "Kuhusu kozi hii",
  "Start Course": "Anza Kozi",
  "Lessons Coming Soon": "Masomo Yanakuja Karibuni",
  "Learning objectives": "Malengo ya kujifunza",
  "By the end of the course,": "Kufikia mwisho wa kozi,",
  "you will be able to": "utaweza",
  Lessons: "Masomo",
  "At the End": "Mwishoni",
  "Pass it to earn your certificate.": "Faulu ili upate cheti chako.",
  "Being prepared. Pass it to earn your certificate.":
    "Linaandaliwa. Faulu ili upate cheti chako.",
  Enrollments: "Waliojiandikisha",
  Certificates: "Vyeti",
  "Course Overview": "Muhtasari wa Kozi",
  "Here's what this course includes.": "Haya ndiyo yaliyomo kwenye kozi hii.",
  "Preview Lessons": "Masomo ya Onyesho",
  "Premium Lessons": "Masomo ya Premium",
  "Practice Quiz": "Jaribio la Mazoezi",
  "Final Quiz": "Jaribio la Mwisho",
  "Start Learning": "Anza Kujifunza",
  "Begin with the free preview lessons, then unlock premium lessons, quizzes, and certificates when you are ready.":
    "Anza na masomo ya bure ya onyesho, kisha fungua masomo ya premium, majaribio na vyeti ukiwa tayari.",
  "Continue to First Lesson": "Endelea kwenye Somo la Kwanza",
  "Lessons have not been added yet.": "Masomo bado hayajaongezwa.",
  "View Pricing Options": "Tazama Chaguo za Bei",
  "Course Lessons": "Masomo ya Kozi",
  "Lesson Outline": "Mpangilio wa Masomo",
  "Follow the course lesson by lesson. Free preview lessons are open to all learners, while premium lessons require access.":
    "Fuata kozi somo kwa somo. Masomo ya bure ya onyesho yako wazi kwa wanafunzi wote, na masomo ya premium yanahitaji ufikiaji.",
  "No lessons added yet": "Bado hakuna masomo",
  "Lessons will appear here once they are added by the admin.":
    "Masomo yataonekana hapa yakishaongezwa na msimamizi.",
  "Free Preview": "Onyesho la Bure",
  Reading: "Makala ya kusoma",
  "Unlock this premium lesson to read the full notes, video and reading.":
    "Fungua somo hili la premium ili upate maelezo kamili, video na makala ya kusoma.",
  "Your Enrollment": "Usajili Wako kwenye Kozi",
  Enrolled: "Umejiandikisha",
  "Not enrolled": "Hujajiandikisha",
  "All lessons complete": "Masomo yote yamekamilika",
  "to save your progress.": "ili kuhifadhi maendeleo yako.",
  "You're enrolled as soon as you start a lesson.":
    "Unajiandikisha mara tu unapoanza somo.",
  "Your Certificate": "Cheti Chako",
  Earned: "Umekipata",
  "Ready to claim": "Kiko tayari kuchukuliwa",
  "Not yet earned": "Bado hujakipata",
  "View certificate": "Tazama cheti",
  "Get your certificate": "Pata cheti chako",
  "Pass the final quiz to earn it.": "Faulu jaribio la mwisho ili ukipate.",
  "Review Course": "Pitia Kozi",
  "Continue Learning": "Endelea Kujifunza",

  // ---- One lesson ----
  "Lesson not found": "Somo halikupatikana",
  Lesson: "Somo",
  of: "kati ya",
  "Premium Lesson": "Somo la Premium",
  "Lesson Position": "Nafasi ya Somo",
  "KWCF LMS Lesson": "Somo la KWCF LMS",
  "Course Outline": "Mpangilio wa Kozi",
  "Track your lessons and unlock premium content.":
    "Fuatilia masomo yako na ufungue maudhui ya premium.",
  Completed: "Limekamilika",
  "Need full access?": "Unahitaji ufikiaji kamili?",
  "Unlock all premium lessons, quizzes, resources, and certificates.":
    "Fungua masomo yote ya premium, majaribio, rasilimali na vyeti.",
  "View Pricing": "Tazama Bei",
  "Free Preview Lesson": "Somo la Bure la Onyesho",
  "Reading Included": "Lina Makala ya Kusoma",
  "Quiz at End": "Jaribio Mwishoni",
  "Lesson Notes": "Maelezo ya Somo",
  "Key Takeaways": "Mambo Muhimu ya Kukumbuka",
  "Required Reading": "Makala ya Lazima Kusoma",
  "Read the supporting material and reflect on how this lesson connects to conservancy governance and management.":
    "Soma makala haya na utafakari jinsi somo hili linavyohusiana na utawala na usimamizi wa hifadhi.",
  "Download Reading": "Pakua Makala",
  "Reading Coming Soon": "Makala Yanakuja Karibuni",
  "Previous Lesson": "Somo Lililotangulia",
  "Next Lesson": "Somo Linalofuata",
  "Continue to Quiz": "Endelea kwenye Jaribio",
  "Lesson Video": "Video ya Somo",
  "Video content will be embedded here once added.":
    "Video itawekwa hapa ikishaongezwa.",
  "Lesson content will appear here once added by the admin.":
    "Maudhui ya somo yataonekana hapa yakishaongezwa na msimamizi.",
  "Lesson complete": "Somo limekamilika",
  "Continuing marks this lesson as complete.":
    "Ukiendelea, somo hili litawekwa alama kuwa limekamilika.",
  "You've finished every lesson in this course. Well done!":
    "Umemaliza masomo yote ya kozi hii. Hongera!",
  "Halfway there! You've finished half of this course.":
    "Umefika nusu! Umemaliza nusu ya kozi hii.",
  "Please login before accessing premium lessons.":
    "Tafadhali ingia kabla ya kufungua masomo ya premium.",
  "This is premium content. Please complete payment or subscription to unlock it.":
    "Haya ni maudhui ya premium. Tafadhali kamilisha malipo au usajili ili kuyafungua.",
  "Checking...": "Inakagua...",
  "Unlock Premium": "Fungua Premium",
  "Checking Premium Access": "Inakagua Ufikiaji wa Premium",
  "Please wait while we confirm your course payment.":
    "Tafadhali subiri tunapothibitisha malipo yako ya kozi.",
  "Premium Lesson Locked": "Somo la Premium Limefungwa",
  "This lesson is premium. Complete payment for this course or use a monthly or annual subscription to unlock it.":
    "Somo hili ni la premium. Lipia kozi hii au tumia usajili wa mwezi au wa mwaka ili kulifungua.",
  "Unlock Course": "Fungua Kozi",
  "Premium access confirmed. This lesson is unlocked.":
    "Ufikiaji wa premium umethibitishwa. Somo hili limefunguliwa.",

  // ---- Video pop-up questions ----
  "Video paused · answer the question below":
    "Video imesimama · jibu swali hapa chini",
  "Quick question ·": "Swali la haraka ·",
  "Correct!": "Sahihi!",
  "Not quite.": "Si sahihi kabisa.",
  "The answer is": "Jibu ni",
  "Continue video": "Endelea na video",
  "Pick an answer to carry on with the video.":
    "Chagua jibu ili uendelee na video.",
  "Exit full screen": "Toka kwenye skrini nzima",
  "Full screen": "Skrini nzima",

  // ---- Quizzes ----
  Course: "Kozi",
  Question: "Swali",
  Questions: "Maswali",
  Correct: "Sahihi",
  Incorrect: "Si sahihi",
  "Pass Mark": "Alama ya Kufaulu",
  "Pass mark:": "Alama ya kufaulu:",
  "Your Score": "Alama Zako",
  "Score so far:": "Alama hadi sasa:",
  "Time left": "Muda uliobaki",
  "Quiz progress": "Maendeleo ya jaribio",
  "Next Question": "Swali Linalofuata",
  "Submit quiz": "Wasilisha jaribio",
  "Submit Quiz": "Wasilisha Jaribio",
  "Submit Final Quiz": "Wasilisha Jaribio la Mwisho",
  "Finish quiz": "Maliza jaribio",
  "Finish Quiz": "Maliza Jaribio",
  "Start Quiz": "Anza Jaribio",
  "Retake Quiz": "Rudia Jaribio",
  "Start a New Attempt": "Anza Jaribio Jipya",
  "Review Answers": "Pitia Majibu",
  "Review Needed": "Unahitaji Kupitia Tena",
  "Review mode": "Hali ya kupitia",
  "Not answered": "Halijajibiwa",
  Answered: "Limejibiwa",
  Submitted: "Liliwasilishwa",
  Grade: "Alama",
  Result: "Matokeo",
  Passed: "Umefaulu",
  "Not Passed": "Hujafaulu",
  "Not passed": "Hujafaulu",
  "This is correct!": "Hili ni sahihi!",
  "This is incorrect.": "Hili si sahihi.",
  "The correct answer is": "Jibu sahihi ni",
  "Loading your attempts...": "Inapakia majaribio yako...",
  "No attempts yet. Your results will be listed here.":
    "Bado hujafanya jaribio. Matokeo yako yataorodheshwa hapa.",
  "This attempt can't be reviewed.": "Jaribio hili haliwezi kupitiwa.",
  "to save your attempts and come back to them later.":
    "ili kuhifadhi majaribio yako na kuyarudia baadaye.",
  "first — you need to be logged in to submit a graded quiz.":
    "kwanza — unahitaji kuwa umeingia ili kuwasilisha jaribio lenye alama.",
  "Please login before submitting your final quiz result.":
    "Tafadhali ingia kabla ya kuwasilisha matokeo ya jaribio lako la mwisho.",
  "Please select a star rating before submitting.":
    "Tafadhali chagua idadi ya nyota kabla ya kuwasilisha.",
  "Submit your final quiz? You can't change your answers afterwards.":
    "Uwasilishe jaribio lako la mwisho? Hutaweza kubadilisha majibu yako baadaye.",
  "Loading final quiz...": "Inapakia jaribio la mwisho...",
  "Preparing your graded assessment.": "Tunaandaa jaribio lako lenye alama.",
  "Complete the final graded quiz to qualify for your certificate.":
    "Kamilisha jaribio la mwisho lenye alama ili ustahili cheti chako.",
  "No final quiz questions yet": "Bado hakuna maswali ya jaribio la mwisho",
  "Final quiz questions added by the admin will appear here.":
    "Maswali ya jaribio la mwisho yatakayoongezwa na msimamizi yataonekana hapa.",
  "You've already passed this quiz with": "Tayari umefaulu jaribio hili kwa",
  "Completed on": "Lilikamilika tarehe",
  ". No need to take it again — your certificate is ready.":
    ". Huna haja ya kulifanya tena — cheti chako kiko tayari.",
  "View Certificate": "Tazama Cheti",
  "and you have": "na una",
  "30 minutes": "dakika 30",
  ". The timer starts when you click Start, and whatever you've answered is submitted automatically when time runs out.":
    ". Saa inaanza unapobonyeza Anza, na ulichojibu kitawasilishwa chenyewe muda ukiisha.",
  "You need": "Unahitaji",
  "or higher to pass. You can retake the quiz if you don't pass.":
    "au zaidi ili kufaulu. Unaweza kurudia jaribio usipofaulu.",
  "Use the question panel to move between questions and change your answers until you submit.":
    "Tumia orodha ya maswali kuhama kati ya maswali na kubadilisha majibu yako hadi utakapowasilisha.",
  "Course Certificate": "Cheti cha Kozi",
  "Final Quiz Complete": "Jaribio la Mwisho Limekamilika",
  "Final Assessment Result": "Matokeo ya Jaribio la Mwisho",
  "Congratulations, you passed!": "Hongera, umefaulu!",
  "Not passed yet": "Bado hujafaulu",
  "You answered": "Umejibu maswali",
  "out of": "kati ya",
  "questions correctly. Passing score is 70%.":
    "kwa usahihi. Alama ya kufaulu ni 70%.",
  "questions correctly.": "kwa usahihi.",
  "Saving your result...": "Inahifadhi matokeo yako...",
  "Your result has been saved to your learner profile.":
    "Matokeo yako yamehifadhiwa kwenye wasifu wako wa mwanafunzi.",
  "You are eligible for a certificate": "Unastahili kupata cheti",
  "Review the lesson notes and try again":
    "Pitia maelezo ya masomo kisha ujaribu tena",
  "You need at least 70% to pass the final quiz. You can retake the quiz after reviewing the course lessons.":
    "Unahitaji angalau 70% ili kufaulu jaribio la mwisho. Unaweza kurudia jaribio baada ya kupitia masomo ya kozi.",
  "Thanks for your feedback!": "Asante kwa maoni yako!",
  "It helps KWCF improve this course for future learners.":
    "Yanaisaidia KWCF kuboresha kozi hii kwa wanafunzi wajao.",
  "How was this course?": "Kozi hii ilikuwaje?",
  "Rate your experience and, if you'd like, tell us more. This is optional.":
    "Tupe tathmini yako na, ukipenda, utueleze zaidi. Si lazima.",
  "Share any feedback about this course (optional)...":
    "Tuandikie maoni yoyote kuhusu kozi hii (si lazima)...",
  "Submit Feedback": "Wasilisha Maoni",
  "Generate Certificate": "Tengeneza Cheti",
  "This is a graded quiz. Select your answers carefully before submitting.":
    "Hili ni jaribio lenye alama. Chagua majibu yako kwa makini kabla ya kuwasilisha.",
  "Loading practice quiz...": "Inapakia jaribio la mazoezi...",
  "Preparing your questions and learning activity.":
    "Tunaandaa maswali yako na zoezi la kujifunza.",
  "Test your understanding before moving to the final quiz.":
    "Pima uelewa wako kabla ya kwenda kwenye jaribio la mwisho.",
  "No practice questions yet": "Bado hakuna maswali ya mazoezi",
  "Practice quiz questions added by the admin will appear here.":
    "Maswali ya jaribio la mazoezi yatakayoongezwa na msimamizi yataonekana hapa.",
  "Check your understanding before the final graded quiz.":
    "Pima uelewa wako kabla ya jaribio la mwisho lenye alama.",
  ". You'll see whether each answer is right straight away, with an explanation.":
    ". Utaona papo hapo kama kila jibu ni sahihi, pamoja na maelezo.",
  "There is no time limit, and you can take it as many times as you like.":
    "Hakuna kikomo cha muda, na unaweza kulifanya mara nyingi upendavyo.",
  "Practice Quiz Review": "Mapitio ya Jaribio la Mazoezi",
  "Back to Quiz Overview": "Rudi kwenye Muhtasari wa Jaribio",
  "Continue to Final Quiz": "Endelea kwenye Jaribio la Mwisho",
  "Practice Quiz Complete": "Jaribio la Mazoezi Limekamilika",
  "Log in next time to save your attempts.":
    "Ingia wakati ujao ili kuhifadhi majaribio yako.",
  "Saving your attempt...": "Inahifadhi jaribio lako...",
  "Saved — you can review this attempt any time.":
    "Limehifadhiwa — unaweza kupitia jaribio hili wakati wowote.",
  "Answer each question and get instant feedback to strengthen your understanding.":
    "Jibu kila swali na upate mrejesho wa papo hapo ili kuimarisha uelewa wako.",

  // ---- My Learning (dashboard) ----
  Welcome: "Karibu",
  back: "tena",
  "Your courses, your progress and your certificates, all in one place.":
    "Kozi zako, maendeleo yako na vyeti vyako, vyote mahali pamoja.",
  "Your courses couldn't be loaded.": "Kozi zako hazikuweza kupakiwa.",
  "Your courses couldn't be loaded. Check your connection and try again.":
    "Kozi zako hazikuweza kupakiwa. Angalia mtandao wako kisha ujaribu tena.",
  "Loading your courses…": "Inapakia kozi zako…",
  "Log in to see your learning": "Ingia ili uone masomo yako",
  "Your courses, progress and certificates are kept with your account.":
    "Kozi zako, maendeleo na vyeti vinahifadhiwa kwenye akaunti yako.",
  "Create an account": "Fungua akaunti",
  "Courses started": "Kozi ulizoanza",
  "Courses completed": "Kozi ulizomaliza",
  "Average progress": "Wastani wa maendeleo",
  "Start the course": "Anza kozi",
  "You've finished every course you started": "Umemaliza kila kozi uliyoanza",
  "Start your first course": "Anza kozi yako ya kwanza",
  "My courses": "Kozi zangu",
  "Review course": "Pitia kozi",

  // ---- Profile ----
  Male: "Mwanamume",
  Female: "Mwanamke",
  "Prefer not to say": "Sipendi kusema",
  "Please login to view your learner profile.":
    "Tafadhali ingia ili uone wasifu wako wa mwanafunzi.",
  "Your account email could not be found. Please login again.":
    "Barua pepe ya akaunti yako haikupatikana. Tafadhali ingia tena.",
  "Learner Profile": "Wasifu wa Mwanafunzi",
  "Track your enrolled courses, quiz results, certificates, payment history, and learning progress.":
    "Fuatilia kozi ulizojiandikisha, matokeo ya majaribio, vyeti, historia ya malipo na maendeleo yako ya kujifunza.",
  "Loading Profile": "Inapakia Wasifu",
  "Please wait while we fetch your learning records.":
    "Tafadhali subiri tunapoleta kumbukumbu zako za masomo.",
  "Profile Unavailable": "Wasifu Haupatikani",
  "Role:": "Nafasi:",
  "Gender:": "Jinsia:",
  "Enrolled Courses": "Kozi Ulizojiandikisha",
  "Quiz Results": "Matokeo ya Majaribio",
  "Passed Finals": "Majaribio ya Mwisho Uliyofaulu",
  "Paid Payments": "Malipo Yaliyolipwa",
  "My Courses": "Kozi Zangu",
  "Your enrolled course progress.": "Maendeleo ya kozi ulizojiandikisha.",
  "In Progress": "Inaendelea",
  Progress: "Maendeleo",
  "My Payments": "Malipo Yangu",
  "Track your course and subscription payment records.":
    "Fuatilia kumbukumbu za malipo yako ya kozi na usajili.",
  "Pending Payments": "Malipo Yanayosubiri",
  "View Payment": "Tazama Malipo",
  "Open Course": "Fungua Kozi",
  "Your submitted practice and final quiz scores.":
    "Alama zako za majaribio ya mazoezi na ya mwisho uliyowasilisha.",
  "No quiz results yet.": "Bado hakuna matokeo ya majaribio.",
  "Quiz •": "Jaribio •",
  "Your issued certificates and verification codes.":
    "Vyeti ulivyopewa na namba zake za uthibitisho.",
  "No certificates issued yet.": "Bado hujapewa cheti.",
  Issued: "Kilitolewa",
  "Need help or have a complaint?": "Unahitaji msaada au una malalamiko?",
  "Email us about a problem with a course, a payment or your account, or to ask for a copy or deletion of your data.":
    "Tuandikie barua pepe kuhusu tatizo la kozi, malipo au akaunti yako, au kuomba nakala au kufutwa kwa data yako.",
  "Your data rights": "Haki zako za data",
  "My Details": "Taarifa Zangu",
  "Your details have been saved.": "Taarifa zako zimehifadhiwa.",
  "We couldn't save your details.": "Hatukuweza kuhifadhi taarifa zako.",
  "We couldn't save your details. Please try again.":
    "Hatukuweza kuhifadhi taarifa zako. Tafadhali jaribu tena.",
  "Edit Details": "Hariri Taarifa",
  "Change Password": "Badilisha Nenosiri",
  "Your name is on an issued certificate, so it can't be changed here. To correct it, email":
    "Jina lako liko kwenye cheti kilichotolewa, kwa hiyo haliwezi kubadilishwa hapa. Ili kulirekebisha, tuma barua pepe kwa",
  "This is the name printed on your certificates, so please check the spelling.":
    "Hili ndilo jina litakalochapishwa kwenye vyeti vyako, kwa hiyo tafadhali hakikisha limeandikwa sawasawa.",
  "Choose an option": "Chagua moja",
  "Your email address (": "Barua pepe yako (",
  ") is your login and can't be changed here.":
    ") ndiyo unayoingia nayo na haiwezi kubadilishwa hapa.",
  "Save Changes": "Hifadhi Mabadiliko",

  // ---- Log in ----
  "Learner Login": "Kuingia kwa Mwanafunzi",
  "Login to Your KWCF LMS": "Ingia kwenye",
  Account: "Akaunti",
  "Sign in to continue learning, access your courses, track quiz progress, and manage your certificates.":
    "Ingia ili uendelee kujifunza, ufikie kozi zako, ufuatilie maendeleo ya majaribio na usimamie vyeti vyako.",
  "Use the email and password you registered with.":
    "Tumia barua pepe na nenosiri ulilojisajili nalo.",
  "Email Address": "Barua Pepe",
  "Enter your email": "Andika barua pepe yako",
  "Enter your password": "Andika nenosiri lako",
  "Forgot your password?": "Umesahau nenosiri?",
  "Logging In...": "Unaingia...",
  "Do not have an account?": "Huna akaunti?",
  "Register here": "Jisajili hapa",
  "Your learner account helps you": "Akaunti yako ya mwanafunzi inakusaidia",
  "Continue learning": "Kuendelea kujifunza",
  "Return to courses and continue where you left off.":
    "Rudi kwenye kozi na uendelee ulipoishia.",
  "Track quiz results": "Kufuatilia matokeo ya majaribio",
  "Your final quiz results will later be linked to your learner profile.":
    "Matokeo ya majaribio yako ya mwisho yataunganishwa na wasifu wako wa mwanafunzi.",
  "Access certificates": "Kupata vyeti",
  "Certificates will be issued under your verified learner account.":
    "Vyeti vitatolewa chini ya akaunti yako ya mwanafunzi iliyothibitishwa.",
  "Please enter your email address.": "Tafadhali andika barua pepe yako.",
  "Please enter your password.": "Tafadhali andika nenosiri lako.",
  "✅ Logged in successfully!": "✅ Umeingia!",
  "Need help signing in?": "Unahitaji msaada wa kuingia?",
  "Resetting your password by email isn't available yet. If you've forgotten your password, email":
    "Kubadilisha nenosiri kwa barua pepe bado hakupatikani. Ukiwa umesahau nenosiri lako, tuma barua pepe kwa",
  "from the address you registered with and we'll help you get back in.":
    "kutoka kwenye anwani uliyojisajili nayo na tutakusaidia kuingia tena.",

  // ---- Forgot / new password ----
  "Forgot your": "Umesahau",
  "password?": "nenosiri?",
  "Enter the email you registered with and we'll send you a link to choose a new one.":
    "Andika barua pepe uliyojisajili nayo na tutakutumia kiungo cha kuchagua nenosiri jipya.",
  "Send Reset Link": "Tuma Kiungo",
  "Check your email": "Angalia barua pepe yako",
  "If an account exists for": "Kama kuna akaunti ya",
  ", we have sent a link to choose a new password. It may take a few minutes, so please check your spam folder too.":
    ", tumetuma kiungo cha kuchagua nenosiri jipya. Huenda ikachukua dakika chache, kwa hiyo tafadhali angalia pia folda ya spam.",
  "Use a different email": "Tumia barua pepe nyingine",
  "We couldn't send the email just now. Please try again shortly.":
    "Hatukuweza kutuma barua pepe kwa sasa. Tafadhali jaribu tena baada ya muda mfupi.",
  "Choose a new": "Chagua",
  password: "nenosiri jipya",
  "New Password": "Nenosiri Jipya",
  "Create a new password": "Tunga nenosiri jipya",
  "Confirm New Password": "Thibitisha Nenosiri Jipya",
  "Type it again": "Liandike tena",
  "Save New Password": "Hifadhi Nenosiri Jipya",
  "Password changed": "Nenosiri limebadilishwa",
  "Your new password is saved and you're signed in.":
    "Nenosiri lako jipya limehifadhiwa na umeingia.",
  "The two passwords don't match.": "Manenosiri hayo mawili hayafanani.",
  "Please choose a password different from your old one.":
    "Tafadhali chagua nenosiri tofauti na la zamani.",
  "That password is too easy to guess. Please choose a stronger one.":
    "Nenosiri hilo ni rahisi mno kukisiwa. Tafadhali chagua lililo imara zaidi.",
  "We couldn't save your new password. Please try again.":
    "Hatukuweza kuhifadhi nenosiri lako jipya. Tafadhali jaribu tena.",
  "Checking your reset link…": "Inakagua kiungo chako…",
  "This link isn't valid": "Kiungo hiki si halali",
  "Reset links expire and can only be used once. Please request a new one and use the latest email we send you.":
    "Viungo vya kubadilisha nenosiri huisha muda na hutumika mara moja tu. Tafadhali omba kipya na utumie barua pepe ya mwisho tutakayokutumia.",
  "Request a New Link": "Omba Kiungo Kipya",

  // ---- Register ----
  "Learner Registration": "Usajili wa Mwanafunzi",
  "Create Your KWCF LMS": "Fungua",
  "Register as a learner to access courses, track progress, complete quizzes, and receive certificates.":
    "Jisajili kama mwanafunzi ili ufikie kozi, ufuatilie maendeleo, ufanye majaribio na upokee vyeti.",
  "Create your learner profile using your name, email, and password.":
    "Fungua wasifu wako wa mwanafunzi kwa kutumia jina lako, barua pepe na nenosiri.",
  "Full Name": "Jina Kamili",
  "Enter your full name": "Andika jina lako kamili",
  Gender: "Jinsia",
  "Select gender": "Chagua jinsia",
  "Create a password": "Tunga nenosiri",
  "Use at least 6 characters.": "Tumia angalau herufi 6.",
  "Data consent": "Idhini ya data",
  "I consent to KWCF LMS collecting and processing my registration details and course activity (progress, quiz results, and certificates) for the purpose of delivering this course and reporting on platform usage, as set out in the":
    "Ninakubali KWCF LMS ikusanye na kuchakata taarifa zangu za usajili na shughuli zangu za kozi (maendeleo, matokeo ya majaribio na vyeti) kwa madhumuni ya kutoa kozi hii na kuripoti matumizi ya jukwaa, kama ilivyoelezwa katika",
  ", and I agree to the": ", na ninakubali",
  "Creating Account...": "Inafungua Akaunti...",
  "Create Account": "Fungua Akaunti",
  "Already have an account?": "Tayari una akaunti?",
  "Login here": "Ingia hapa",
  "Why create an account?": "Kwa nini ufungue akaunti?",
  "Track your learning": "Fuatilia masomo yako",
  "Keep your course progress, quiz records, and certificates in one learner profile.":
    "Hifadhi maendeleo ya kozi, kumbukumbu za majaribio na vyeti katika wasifu mmoja wa mwanafunzi.",
  "Access premium content": "Fikia maudhui ya premium",
  "Login will later connect to payments and subscriptions for premium courses.":
    "Akaunti yako itaunganishwa na malipo na usajili wa kozi za premium.",
  "Receive certificates": "Pokea vyeti",
  "Certificates will be linked to your verified learner account.":
    "Vyeti vitaunganishwa na akaunti yako ya mwanafunzi iliyothibitishwa.",
  "Your data, protected": "Data yako inalindwa",
  "Creating an account means you consent to KWCF LMS collecting and processing your registration details and course activity, as described during signup.":
    "Kufungua akaunti kunamaanisha unakubali KWCF LMS ikusanye na kuchakata taarifa zako za usajili na shughuli zako za kozi, kama ilivyoelezwa wakati wa kujisajili.",
  "Please enter your full name.": "Tafadhali andika jina lako kamili.",
  "Password must be at least 6 characters.":
    "Nenosiri lazima liwe na angalau herufi 6.",
  "Please select your gender.": "Tafadhali chagua jinsia yako.",
  "Please agree to the data consent statement before creating your account.":
    "Tafadhali kubali taarifa ya idhini ya data kabla ya kufungua akaunti yako.",
  "✅ Account created successfully. Welcome!":
    "✅ Akaunti imefunguliwa. Karibu!",
  "✅ Account created successfully. Please check your email to confirm your account, then login.":
    "✅ Akaunti imefunguliwa. Tafadhali angalia barua pepe yako kuthibitisha akaunti, kisha uingie.",

  // ---- Pricing and payments ----
  "Premium Access": "Ufikiaji wa Premium",
  "Unlock KWCF LMS": "Fungua",
  Learning: "Mafunzo",
  "Choose a payment option to access premium lessons, final quizzes, downloadable resources, and certificates.":
    "Chagua njia ya malipo ili ufikie masomo ya premium, majaribio ya mwisho, rasilimali za kupakua na vyeti.",
  "Unlocking one specific course": "Kufungua kozi moja mahususi",
  "The Pay Per Course option will be attached to the course you were trying to access. Once the payment is marked as paid, premium lessons for that course can be opened.":
    "Chaguo la Lipa kwa Kozi litaunganishwa na kozi uliyokuwa unajaribu kuifungua. Malipo yakishathibitishwa, masomo ya premium ya kozi hiyo yatafunguka.",
  "Pay Per Course": "Lipa kwa Kozi",
  "Single Course": "Kozi Moja",
  "Best for learners who want access to one specific course and its certificate.":
    "Inafaa kwa wanafunzi wanaotaka kozi moja mahususi na cheti chake.",
  "per course": "kwa kozi",
  "Access to one premium course": "Ufikiaji wa kozi moja ya premium",
  "All lessons unlocked for that course": "Masomo yote ya kozi hiyo yanafunguliwa",
  "Practice and final quiz": "Jaribio la mazoezi na la mwisho",
  "Certificate after completion": "Cheti baada ya kumaliza",
  "Create Course Payment": "Anzisha Malipo ya Kozi",
  "Create Pay Per Course Payment": "Anzisha Malipo ya Kozi Moja",
  "For best results, choose this option after opening a locked premium lesson so the payment links to that exact course.":
    "Kwa matokeo bora, chagua chaguo hili baada ya kufungua somo la premium lililofungwa ili malipo yaunganishwe na kozi hiyo hasa.",
  Recommended: "Inapendekezwa",
  "Monthly Subscription": "Usajili wa Mwezi",
  "Monthly Access": "Ufikiaji wa Mwezi",
  "Best for active learners who want access to several KWCF LMS courses.":
    "Inafaa kwa wanafunzi wanaotaka kozi kadhaa za KWCF LMS.",
  "per month": "kwa mwezi",
  "Access to all premium courses": "Ufikiaji wa kozi zote za premium",
  "All lessons and readings unlocked": "Masomo na makala yote yanafunguliwa",
  "Unlimited quizzes": "Majaribio bila kikomo",
  "Certificates for completed courses": "Vyeti vya kozi ulizomaliza",
  "Create Monthly Payment": "Anzisha Malipo ya Mwezi",
  "Annual Subscription": "Usajili wa Mwaka",
  "Annual Access": "Ufikiaji wa Mwaka",
  "Best for organizations, staff teams, or long-term learners.":
    "Inafaa kwa mashirika, timu za wafanyakazi au wanafunzi wa muda mrefu.",
  "per year": "kwa mwaka",
  "Full-year access": "Ufikiaji wa mwaka mzima",
  "All premium courses included": "Kozi zote za premium zimejumuishwa",
  "Certificates included": "Vyeti vimejumuishwa",
  "Best value for long-term learning": "Thamani bora kwa kujifunza kwa muda mrefu",
  "Create Annual Payment": "Anzisha Malipo ya Mwaka",
  "Payment Methods": "Njia za Malipo",
  "Planned payment options for the KWCF LMS.":
    "Njia za malipo zinazopangwa kwa KWCF LMS.",
  "Mobile money payment option for learners in Kenya.":
    "Malipo kwa simu kwa wanafunzi walioko Kenya.",
  "Card, mobile money, and payment reference support.":
    "Kadi, malipo kwa simu na namba ya kumbukumbu ya malipo.",
  "Institutional Payment": "Malipo ya Taasisi",
  "Partner or organization-sponsored access for groups.":
    "Ufikiaji wa vikundi unaofadhiliwa na mshirika au shirika.",
  "Premium Access Notice": "Taarifa kuhusu Ufikiaji wa Premium",
  "Payments are confirmed by our team for now. Paying directly online, by card or M-PESA, is planned.":
    "Kwa sasa malipo yanathibitishwa na timu yetu. Kulipa moja kwa moja mtandaoni, kwa kadi au M-PESA, kunapangwa.",
  "How it works for now": "Jinsi inavyofanya kazi kwa sasa",
  "Choose a plan and your payment is recorded as pending. Once our team confirms it, your premium lessons unlock.":
    "Chagua mpango na malipo yako yatarekodiwa kuwa yanasubiri. Timu yetu ikishayathibitisha, masomo yako ya premium yatafunguka.",
  "Please login before choosing a payment plan.":
    "Tafadhali ingia kabla ya kuchagua mpango wa malipo.",
  "Creating Payment...": "Inaanzisha Malipo...",
  "Payment Confirmation": "Uthibitisho wa Malipo",
  "Payment Record": "Kumbukumbu ya Malipo",
  Created: "Imeundwa",
  "Your payment request has been saved. Once the admin confirms it, you can check the status here and continue to your course.":
    "Ombi lako la malipo limehifadhiwa. Msimamizi akishalithibitisha, unaweza kuangalia hali hapa na kuendelea na kozi yako.",
  "Payment not found": "Malipo hayakupatikana",
  "We could not find a payment record for this request.":
    "Hatukupata kumbukumbu ya malipo ya ombi hili.",
  "Payment Confirmed": "Malipo Yamethibitishwa",
  "Payment Failed": "Malipo Yameshindikana",
  "Pending Payment": "Malipo Yanasubiri",
  "Premium Access Unlocked": "Ufikiaji wa Premium Umefunguliwa",
  "Payment Could Not Be Confirmed": "Malipo Hayakuweza Kuthibitishwa",
  "Payment Awaiting Confirmation": "Malipo Yanasubiri Kuthibitishwa",
  "This record is currently marked as PENDING. After admin confirmation, click the status check button below to continue.":
    "Kumbukumbu hii kwa sasa inasubiri. Baada ya msimamizi kuthibitisha, bonyeza kitufe cha kuangalia hali hapa chini ili uendelee.",
  Learner: "Mwanafunzi",
  "Payment Type": "Aina ya Malipo",
  Amount: "Kiasi",
  Provider: "Mtoa Huduma",
  Reference: "Kumbukumbu",
  "Subscription / General Access": "Usajili / Ufikiaji wa Jumla",
  "How your payment is confirmed": "Jinsi malipo yako yanavyothibitishwa",
  "Our team confirms each payment by hand. Once yours is confirmed, click the button below to refresh your payment status and continue.":
    "Timu yetu inathibitisha kila malipo moja moja. Yako yakishathibitishwa, bonyeza kitufe hapa chini ili kusasisha hali ya malipo yako na kuendelea.",
  "Payment confirmed. Premium access is now unlocked.":
    "Malipo yamethibitishwa. Ufikiaji wa premium sasa umefunguliwa.",
  "Checking Payment...": "Inakagua Malipo...",
  "Check Payment Status & Continue": "Angalia Hali ya Malipo na Uendelee",

  // ---- Certificates ----
  "Please login before generating your certificate.":
    "Tafadhali ingia kabla ya kutengeneza cheti chako.",
  "You need to pass the final quiz before a certificate can be issued.":
    "Unahitaji kufaulu jaribio la mwisho kabla ya cheti kutolewa.",
  "Issuing certificate...": "Inatoa cheti...",
  "Loading certificate...": "Inapakia cheti...",
  "Please wait while we prepare your official KWCF LMS certificate.":
    "Tafadhali subiri tunapoandaa cheti chako rasmi cha KWCF LMS.",
  "KWCF LMS Certificate": "Cheti cha KWCF LMS",
  "Course Completion Certificate": "Cheti cha Kumaliza Kozi",
  "This certificate confirms successful course completion and passing of the final graded quiz.":
    "Cheti hiki kinathibitisha kumaliza kozi kwa mafanikio na kufaulu jaribio la mwisho lenye alama.",
  "Preparing PDF...": "Inaandaa PDF...",
  "Download PDF": "Pakua PDF",
  "The PDF couldn't be made in this browser. Use Print and choose \"Save as PDF\" instead.":
    "PDF haikuweza kutengenezwa kwenye kivinjari hiki. Tumia Chapisha kisha uchague \"Save as PDF\".",
  "Verified Completion": "Kumaliza Kumethibitishwa",
  "This certificate is linked to the learner profile and course completion record.":
    "Cheti hiki kimeunganishwa na wasifu wa mwanafunzi na kumbukumbu ya kumaliza kozi.",
  "Shareable Proof": "Uthibitisho wa Kushiriki",
  "Learners can print, download, or verify this certificate for records.":
    "Wanafunzi wanaweza kuchapisha, kupakua au kuthibitisha cheti hiki kwa kumbukumbu.",

  // ---- Verify a certificate ----
  "Certificate Verification": "Uthibitishaji wa Cheti",
  "Verify a KWCF LMS": "Thibitisha",
  Certificate: "Cheti",
  "Enter a certificate code to confirm whether the certificate was issued by the KWCF Learning Management System.":
    "Andika namba ya cheti ili kuthibitisha kama cheti kilitolewa na mfumo wa mafunzo wa KWCF.",
  "Verification Search": "Tafuta Cheti",
  "Use the unique certificate code printed on the learner's certificate.":
    "Tumia namba ya kipekee iliyochapishwa kwenye cheti cha mwanafunzi.",
  "Certificate Code": "Namba ya Cheti",
  "Example: KWCF-COURSE-2026-7H2KQ9XM": "Mfano: KWCF-COURSE-2026-7H2KQ9XM",
  "Verify Certificate": "Thibitisha Cheti",
  "Certificate Not Verified": "Cheti Hakijathibitishwa",
  "Certificate details will appear here": "Taarifa za cheti zitaonekana hapa",
  "Once a valid certificate code is entered, the LMS will display the learner name, course title, issue date, and verification status.":
    "Namba halali ya cheti ikishaandikwa, mfumo utaonyesha jina la mwanafunzi, jina la kozi, tarehe ya kutolewa na hali ya uthibitisho.",
  "Valid Certificate": "Cheti Halali",
  "Certificate Verified": "Cheti Kimethibitishwa",
  "This certificate was found in the KWCF LMS database and is linked to the learner and course shown below.":
    "Cheti hiki kimepatikana kwenye kumbukumbu za KWCF LMS na kimeunganishwa na mwanafunzi na kozi iliyoonyeshwa hapa chini.",
  "Learner Name": "Jina la Mwanafunzi",
  "Course Title": "Jina la Kozi",
  "Issue Date": "Tarehe ya Kutolewa",
  "Please enter a certificate code.": "Tafadhali andika namba ya cheti.",
  "Certificate could not be verified.": "Cheti hakikuweza kuthibitishwa.",

  // ---- Not found, errors ----
  "Page not found": "Ukurasa haukupatikana",
  "This path leads": "Njia hii inaelekea",
  "off the map": "nje ya ramani",
  "The page may have moved, or the link may be mistyped. The courses are a good place to pick the trail back up.":
    "Huenda ukurasa umehamishwa, au kiungo kimeandikwa vibaya. Kozi ni mahali pazuri pa kuanzia tena.",
  "Something went wrong": "Hitilafu imetokea",
  "The page couldn't load. Your progress is safe. Try again, and if it keeps happening, come back in a few minutes.":
    "Ukurasa haukuweza kupakiwa. Maendeleo yako yako salama. Jaribu tena, na tatizo likiendelea, rudi baada ya dakika chache.",

  // ---- Homepage: values and module list ----
  Movement: "Harakati",
  "Empower conservancy leaders with the knowledge and tools to build sustainable, community centred conservation initiatives.":
    "Kuwawezesha viongozi wa hifadhi kwa maarifa na zana za kujenga mipango endelevu ya uhifadhi inayolenga jamii.",
  "Place women and youth at the centre of conservation leadership, creating lasting intergenerational impact in conservancy communities.":
    "Kuwaweka wanawake na vijana katikati ya uongozi wa uhifadhi, na kuleta matokeo ya kudumu kwa vizazi katika jamii za hifadhi.",
  "Learn from experienced conservancy managers and wildlife conservation professionals.":
    "Jifunze kutoka kwa mameneja wa hifadhi wenye uzoefu na wataalamu wa uhifadhi wa wanyamapori.",
  "Connect with fellow conservancy leaders and share experiences across Kenya.":
    "Ungana na viongozi wenzako wa hifadhi na mbadilishane uzoefu kote Kenya.",
  Foundations: "Misingi",
  Governance: "Utawala",
  Management: "Usimamizi",
  Finance: "Fedha",
  Climate: "Tabianchi",
  Planning: "Mipango",
  Inclusion: "Ujumuishaji",
  Standards: "Viwango",
  "Understand the fundamentals of conservancy structure, governance, legal frameworks, and the vital role conservancies play in Kenya's ecosystems.":
    "Elewa misingi ya muundo wa hifadhi, utawala, sheria zinazohusika, na nafasi muhimu ya hifadhi katika mifumo ya ikolojia ya Kenya.",
  "Learn the legal, community, and ecological steps required to set up a thriving, well-governed conservancy from the ground up.":
    "Jifunze hatua za kisheria, za kijamii na za kiikolojia zinazohitajika kuanzisha hifadhi inayostawi na yenye utawala bora tangu mwanzo.",
  "Master day-to-day operations, staffing, resource allocation, and strategic planning to keep your conservancy running at its best.":
    "Jifunze kwa kina shughuli za kila siku, usimamizi wa wafanyakazi, ugawaji wa rasilimali na mipango ya kimkakati ili hifadhi yako ifanye kazi kwa ubora.",
  "Explore tourism, grants, and community enterprise models that generate lasting income while protecting wildlife and natural resources.":
    "Chunguza utalii, ruzuku na miradi ya biashara ya jamii inayoleta mapato ya kudumu huku ikilinda wanyamapori na maliasili.",
  "Run inclusive, transparent, and effective AGMs that strengthen member trust, accountability, and democratic conservancy governance.":
    "Endesha mikutano mikuu ya mwaka iliyo jumuishi, ya uwazi na yenye ufanisi, inayoimarisha imani ya wanachama, uwajibikaji na utawala wa kidemokrasia wa hifadhi.",
  "Develop verifiable, internationally recognised carbon credit projects that generate income and contribute to climate solutions.":
    "Anzisha miradi ya kaboni inayoweza kuthibitishwa na kutambulika kimataifa, inayoleta mapato na kuchangia suluhisho za tabianchi.",
  "Craft clear, actionable management plans that guide your conservancy's ecology, finances, and community relations for years ahead.":
    "Andaa mipango ya usimamizi iliyo wazi na inayotekelezeka, itakayoongoza ikolojia, fedha na mahusiano ya jamii ya hifadhi yako kwa miaka ijayo.",
  "Build strategies to place women and youth at the centre of leadership, ensuring representation and lasting intergenerational impact.":
    "Jenga mikakati ya kuwaweka wanawake na vijana katikati ya uongozi, ili kuhakikisha uwakilishi na matokeo ya kudumu kwa vizazi.",
  "Navigate the criteria and processes required to achieve international Greenlisting recognition and long-term credibility.":
    "Fahamu vigezo na taratibu zinazohitajika ili kupata utambuzi wa kimataifa wa Green List na kuaminika kwa muda mrefu.",

  // ---- Quiz introductions and results ----
  "This is the graded final quiz. Your score is saved to your learner profile and decides whether you receive the course certificate.":
    "Hili ni jaribio la mwisho lenye alama. Alama zako zinahifadhiwa kwenye wasifu wako wa mwanafunzi na ndizo zinazoamua kama utapata cheti cha kozi.",
  "Before you click Start, make sure you have enough time to finish the quiz in one sitting.":
    "Kabla ya kubonyeza Anza, hakikisha una muda wa kutosha kumaliza jaribio kwa mkao mmoja.",
  "Your final quiz has been submitted. Review your result below.":
    "Jaribio lako la mwisho limewasilishwa. Tazama matokeo yako hapa chini.",
  "You have passed the final quiz. You can now proceed to generate your course certificate.":
    "Umefaulu jaribio la mwisho. Sasa unaweza kuendelea kutengeneza cheti chako cha kozi.",
  "This ungraded practice quiz has been designed to help you prepare for the final graded quiz.":
    "Jaribio hili la mazoezi halina alama, na limeandaliwa kukusaidia kujiandaa kwa jaribio la mwisho lenye alama.",
  "When you finish, use Review to go through every question and see which ones you passed and which ones to revisit.":
    "Ukimaliza, tumia Pitia kuangalia kila swali na kuona yapi umepata na yapi unahitaji kuyarudia.",
  "See which questions you got right, which ones you missed, and why.":
    "Ona maswali uliyopata, uliyokosa, na sababu zake.",
  "You have completed the practice quiz. Review your answers, or continue to the final graded quiz.":
    "Umemaliza jaribio la mazoezi. Pitia majibu yako, au endelea kwenye jaribio la mwisho lenye alama.",
  "Review the lesson notes and try to understand why this answer is correct.":
    "Pitia maelezo ya somo na ujaribu kuelewa kwa nini jibu hili ni sahihi.",
  "This question was not answered.": "Swali hili halikujibiwa.",
  "A practical conservation learning course designed to support conservancy teams, leaders, and community-based conservation work.":
    "Kozi ya vitendo ya uhifadhi iliyoundwa kusaidia timu za hifadhi, viongozi na kazi za uhifadhi wa kijamii.",

  // ---- My Learning, profile and payments (more) ----
  "Pick up where you left off": "Endelea ulipoishia",
  "Have a look at the other courses when you're ready for the next one.":
    "Angalia kozi nyingine ukiwa tayari kwa inayofuata.",
  "Pick a course and your progress will show up here as you go.":
    "Chagua kozi, na maendeleo yako yataonekana hapa unavyoendelea.",
  "You have not enrolled in any courses yet.": "Bado hujajiandikisha kwenye kozi yoyote.",
  "You have not created any payment records yet.": "Bado huna kumbukumbu zozote za malipo.",
  "Your payment has been confirmed. You can now continue to the course and open premium lessons.":
    "Malipo yako yamethibitishwa. Sasa unaweza kuendelea na kozi na kufungua masomo ya premium.",
  "This payment was marked as failed. Please contact the admin or create a new payment request.":
    "Malipo haya yamewekwa alama kuwa yameshindikana. Tafadhali wasiliana na msimamizi au anzisha ombi jipya la malipo.",
  "Get an email with a link to choose a new password.":
    "Pata barua pepe yenye kiungo cha kuchagua nenosiri jipya.",
  "Too many requests. Please wait a few minutes and try again.":
    "Maombi ni mengi mno. Tafadhali subiri dakika chache kisha ujaribu tena.",
  "This reset link has expired. Please request a new one.":
    "Kiungo hiki kimeisha muda. Tafadhali omba kipya.",

  // ---- "Something went wrong" messages ----
  "Something went wrong while issuing certificate.": "Hitilafu imetokea wakati wa kutoa cheti.",
  "Something went wrong while issuing the certificate.": "Hitilafu imetokea wakati wa kutoa cheti.",
  "Something went wrong while loading the certificate.": "Hitilafu imetokea wakati wa kupakia cheti.",
  "Something went wrong while fetching the certificate.": "Hitilafu imetokea wakati wa kupakia cheti.",
  "Something went wrong while verifying the certificate.": "Hitilafu imetokea wakati wa kuthibitisha cheti.",
  "Something went wrong while loading final quiz.": "Hitilafu imetokea wakati wa kupakia jaribio la mwisho.",
  "Something went wrong while loading the final quiz.": "Hitilafu imetokea wakati wa kupakia jaribio la mwisho.",
  "Something went wrong while loading quiz.": "Hitilafu imetokea wakati wa kupakia jaribio.",
  "Something went wrong while loading the practice quiz.": "Hitilafu imetokea wakati wa kupakia jaribio la mazoezi.",
  "Something went wrong while fetching quiz questions.": "Hitilafu imetokea wakati wa kupakia maswali ya jaribio.",
  "Something went wrong while saving quiz result.": "Hitilafu imetokea wakati wa kuhifadhi matokeo ya jaribio.",
  "Something went wrong while saving your quiz result.": "Hitilafu imetokea wakati wa kuhifadhi matokeo ya jaribio lako.",
  "Something went wrong while saving the quiz result.": "Hitilafu imetokea wakati wa kuhifadhi matokeo ya jaribio.",
  "Something went wrong while saving your feedback.": "Hitilafu imetokea wakati wa kuhifadhi maoni yako.",
  "Something went wrong while opening this review.": "Hitilafu imetokea wakati wa kufungua mapitio haya.",
  "Something went wrong while loading this review.": "Hitilafu imetokea wakati wa kupakia mapitio haya.",
  "Something went wrong while loading your attempts.": "Hitilafu imetokea wakati wa kupakia majaribio yako.",
  "Something went wrong while logging in.": "Hitilafu imetokea wakati wa kuingia.",
  "Something went wrong while logging out.": "Hitilafu imetokea wakati wa kutoka.",
  "Something went wrong while creating your account.": "Hitilafu imetokea wakati wa kufungua akaunti yako.",
  "Something went wrong while loading profile.": "Hitilafu imetokea wakati wa kupakia wasifu.",
  "Something went wrong while loading your profile.": "Hitilafu imetokea wakati wa kupakia wasifu wako.",
  "Something went wrong while fetching the learner profile.": "Hitilafu imetokea wakati wa kupakia wasifu wa mwanafunzi.",
  "Something went wrong while saving your details.": "Hitilafu imetokea wakati wa kuhifadhi taarifa zako.",
  "Something went wrong while checking payment.": "Hitilafu imetokea wakati wa kukagua malipo.",
  "Something went wrong while checking payment status.": "Hitilafu imetokea wakati wa kukagua hali ya malipo.",
  "Something went wrong while creating payment.": "Hitilafu imetokea wakati wa kuanzisha malipo.",
  "Something went wrong while creating payment record.": "Hitilafu imetokea wakati wa kuanzisha malipo.",
  "Something went wrong while checking access.": "Hitilafu imetokea wakati wa kukagua ufikiaji.",
  "Something went wrong while checking premium access.": "Hitilafu imetokea wakati wa kukagua ufikiaji wa premium.",
  "Something went wrong while enrolling in this course.": "Hitilafu imetokea wakati wa kujiandikisha kwenye kozi hii.",
  "Something went wrong while loading the lesson.": "Hitilafu imetokea wakati wa kupakia somo.",
  "Something went wrong while updating progress.": "Hitilafu imetokea wakati wa kuhifadhi maendeleo.",
  "Something went wrong while fetching learner status.": "Hitilafu imetokea wakati wa kupakia hali ya mwanafunzi.",
  "Rating must be a whole number between 1 and 5.": "Tathmini lazima iwe namba kamili kati ya 1 na 5.",
  "This course has no quiz questions to grade against.": "Kozi hii haina maswali ya jaribio ya kusahihishia.",
  "This attempt was taken before reviews were saved.": "Jaribio hili lilifanywa kabla ya mapitio kuanza kuhifadhiwa.",
  "Your name is on an issued certificate, so it can't be changed here. Please email complaints@kwcakenya.com to correct it.":
    "Jina lako liko kwenye cheti kilichotolewa, kwa hiyo haliwezi kubadilishwa hapa. Tafadhali tuma barua pepe kwa complaints@kwcakenya.com ili kulirekebisha.",
  "Too many wrong codes. Please wait a few minutes and try again.":
    "Namba zisizo sahihi ni nyingi mno. Tafadhali subiri dakika chache kisha ujaribu tena.",

  // ---- Messages sent back by the server ----
  "Course not found.": "Kozi haikupatikana.",
  "Lesson not found.": "Somo halikupatikana.",
  "Certificate not found.": "Cheti hakikupatikana.",
  "Certificate code is required.": "Namba ya cheti inahitajika.",
  "You must pass the final quiz for this course before a certificate can be issued.":
    "Lazima ufaulu jaribio la mwisho la kozi hii kabla ya cheti kutolewa.",
  "Payment is required before enrolling in this course.":
    "Malipo yanahitajika kabla ya kujiandikisha kwenye kozi hii.",
  "Premium access required.": "Ufikiaji wa premium unahitajika.",
  "Please choose a valid payment plan.": "Tafadhali chagua mpango halali wa malipo.",
  "Please choose a course to unlock.": "Tafadhali chagua kozi ya kufungua.",
  "Payment record not found.": "Kumbukumbu ya malipo haikupatikana.",
  "Learner profile not found.": "Wasifu wa mwanafunzi haukupatikana.",
  "Attempt not found.": "Jaribio halikupatikana.",
};

/** Phrases with a number or a name inside them. $1, $2 are the parts kept. */
const PATTERNS: [RegExp, string][] = [
  [/^(\d+) free lessons?$/, "Masomo $1 ya bure"],
  [/^(\d+) premium lessons?$/, "Masomo $1 ya premium"],
  [/^(\d+) lessons?$/, "Masomo $1"],
  [/^(\d+) questions?$/, "Maswali $1"],
  [/^(\d+)% complete$/, "$1% imekamilika"],
  [/^(\d+) \/ (\d+) answered$/, "$1 / $2 yamejibiwa"],
  [/^(\d+) \/ (\d+) correct$/, "$1 / $2 sahihi"],
  [/^Not quite\. The correct answer is (.+)\.$/, "Si sahihi kabisa. Jibu sahihi ni $1."],
  [/^Use (.+) to verify this certificate later\.$/, "Tumia $1 kuthibitisha cheti hiki baadaye."],
  [/^Please use at least (\d+) characters\.$/, "Tafadhali tumia angalau herufi $1."],
  [/^Rate (\d+) stars?$/, "Toa nyota $1"],
  [
    /^Too many wrong codes\. Please wait (\d+) minutes? and try again\.$/,
    "Namba zisizo sahihi ni nyingi mno. Tafadhali subiri dakika $1 kisha ujaribu tena.",
  ],
  [/^Switch to dark mode$/, "Badili kuwa hali ya giza"],
  [/^Switch to light mode$/, "Badili kuwa hali ya mwanga"],
];

// Curly and straight apostrophes are treated as the same.
const tidy = (text: string) =>
  text.replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();

const phrases = new Map(
  Object.entries(PHRASES).map(([english, kiswahili]) => [tidy(english), kiswahili])
);

/** The Kiswahili for a piece of English, or null to leave it as it is. */
export function toKiswahili(text: string): string | null {
  const key = tidy(text);
  if (!key) return null;

  const phrase = phrases.get(key);
  if (phrase) return phrase;

  for (const [pattern, replacement] of PATTERNS) {
    if (pattern.test(key)) return key.replace(pattern, replacement);
  }

  return null;
}
