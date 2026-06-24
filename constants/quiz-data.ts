export const quiz = [
  {
    id: 1,
    title: "Introduction to React Native",
    question: "How does React Native render user interface elements components on mobile devices?",
    options: [
      "It compiles entirely into the standard website embedded inside a WebView.",
      "It bridges JavaScript code to invoke native platform UI views.",
      "It bypasses mobile OS architectures and draws pixels directly via Canvas.",
      "It translates everything into C++ binary files before execution.",
    ],
    answer: "It bridges JavaScript code to invoke native platform UI views.",
  },
  {
    id: 2,
    title: "Setup & Environment",
    question:
      "Which tool allows you to build and run React Native projects quickly without installing Android Studio or Xcode configurations locally?",
    options: ["Metro Bundler", "Expo Go", "React Native CLI", "Cocoapods"],
    answer: "Expo Go",
  },
  {
    id: 3,
    title: "Core Components",
    question:
      "Which core React Native component maps directly to a native wrapper that displays plaintext on screen?",
    options: ["<View>", "<ScrollView>", "<Text>", "<SafeAreaView>"],
    answer: "<Text>",
  },
  {
    id: 4,
    title: "Props & Customization",
    question: "Which of the following best describes 'Props' in React Native?",
    options: [
      "Data managed internally within a component that can change over time.",
      "Global application values that cannot be accessed by child components.",
      "Immutable configuration arguments passed down from parent to child components.",
      "Functions used exclusively to run network requests.",
    ],
    answer: "Immutable configuration arguments passed down from parent to child components.",
  },
  {
    id: 5,
    title: "State Management",
    question:
      "When dealing with local component state via the 'useState' hook, what happens automatically when the state updater function is called?",
    options: [
      "The component triggers a re-render to update the user interface.",
      "The application completely restarts its bundle execution.",
      "The data is immediately stored permanently inside the device storage.",
      "The state freezes and becomes a read-only prop property.",
    ],
    answer: "The component triggers a re-render to update the user interface.",
  },
];
