import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef, useCallback } from "react";
import { quiz } from "@/constants/quiz-data";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const CountdownTimer = ({ seconds = 30, onTimeUp, resetKey }) => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(seconds);
    setIsActive(true);
  }, [resetKey, seconds]);

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
      onTimeUp?.();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, secondsLeft, onTimeUp]);

  const formatTime = (timeInSeconds) => {
    return timeInSeconds.toString();
  };

  return (
    <Text
      style={{
        fontSize: 18,
        fontWeight: "900",
        color: secondsLeft <= 5 ? "#EF4444" : "#1E293B",
      }}
    >
      {formatTime(secondsLeft)}s
    </Text>
  );
};

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const transitionTimeoutRef = useRef(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    return () => clearTransitionTimeout();
  }, []);

  const total = quiz.length;
  const currentQuestion = quiz[current];
  const isLastQuestion = current === total - 1;

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    clearTransitionTimeout();

    setSelectedOption(null);
    setShowFeedback(false);
    setShowTimeoutModal(false);

    if (isLastQuestion) {
      setShowResults(true);
      isTransitioningRef.current = false;
    } else {
      setCurrent((prev) => prev + 1);
      setTimerResetKey((prev) => prev + 1);
      transitionTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
      }, 300);
    }
  }, [isLastQuestion]);

  const handleTimeUp = useCallback(() => {
    if (isTransitioningRef.current) return;
    setShowTimeoutModal(true);
    transitionTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, 1500);
  }, [handleNext]);

  const handleOptionPress = (option) => {
    if (showFeedback || showTimeoutModal || isTransitioningRef.current) return;

    setSelectedOption(option);
    setShowFeedback(true);

    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowTimeoutModal(false);
    setShowResults(false);
    setTimerResetKey((prev) => prev + 1);
  };

  const getOptionStyle = (option) => {
    if (!showFeedback && !showTimeoutModal) return styles.options;

    if (option === currentQuestion.answer) {
      return [styles.options, styles.correctOption];
    }

    if (option === selectedOption && option !== currentQuestion.answer) {
      return [styles.options, styles.wrongOption];
    }

    return [styles.options, styles.dimmedOption];
  };

  const getOptionTextStyle = (option) => {
    if (!showFeedback && !showTimeoutModal) return styles.optionText;

    if (option === currentQuestion.answer) {
      return [styles.optionText, styles.correctOptionText];
    }

    if (option === selectedOption && option !== currentQuestion.answer) {
      return [styles.optionText, styles.wrongOptionText];
    }

    return [styles.optionText, styles.dimmedOptionText];
  };

  if (showResults) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.resultsContainer}>
          <Entypo name="trophy" size={80} color="#3B82F6" />
          <Text style={styles.resultsTitle}>Exam Results</Text>
          <Text style={styles.resultsScore}>
            Score: {score} / {total} Correct
          </Text>
          <Text style={styles.resultsPercent}>{(score / total) * 100}%</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <MaterialCommunityIcons name="file-document-multiple" size={16} color="#355155" />
            <Text style={styles.resultsMessage}>Review the core fundamentals and try again.</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Ionicons name="reload" size={24} color="white" />
            <Text style={styles.buttonText}>Restart Laboratory Exam</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ gap: 10 }}>
          <View style={styles.header}>
            <View style={styles.textHeader}>
              <Text style={{ fontWeight: "900", color: "#3B82F6" }}>
                {currentQuestion.title.toUpperCase()}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>
                Question {current + 1} of {total}
              </Text>
            </View>
            <View style={styles.timer}>
              <Entypo name="stopwatch" size={18} color="black" />
              <CountdownTimer seconds={30} onTimeUp={handleTimeUp} resetKey={timerResetKey} />
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBarFill, { width: `${((current + 1) / total) * 100}%` }]}
            />
          </View>
        </View>
        <ScrollView style={{ gap: 10, paddingVertical: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "900" }}>{currentQuestion.question}</Text>
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={getOptionStyle(option)}
                onPress={() => handleOptionPress(option)}
                disabled={showFeedback || showTimeoutModal}
              >
                <Text style={getOptionTextStyle(option)}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.nextButton}>
        <TouchableOpacity
          style={[styles.button, !showFeedback && !showTimeoutModal && styles.disabledButton]}
          disabled={!showFeedback && !showTimeoutModal}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {isLastQuestion ? "Finish Quiz" : "Proceed to Next Question"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showTimeoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Entypo name="stopwatch" size={48} color="#EF4444" />
            <Text style={styles.modalTitle}>Time&apos;s Up!</Text>
            <Text style={styles.modalMessage}>
              You ran out of time. Moving to the next question...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textHeader: {
    flexDirection: "column",
    gap: 5,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  optionsContainer: {
    paddingVertical: 20,
    gap: 10,
    width: "100%",
  },
  options: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1E293B",
  },
  correctOption: {
    backgroundColor: "#F0FDF4",
    borderColor: "#22C55E",
    borderWidth: 2,
  },
  correctOptionText: {
    color: "#22C55E",
    fontWeight: "700",
  },
  wrongOption: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  wrongOptionText: {
    color: "#EF4444",
    fontWeight: "700",
  },
  dimmedOption: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    opacity: 0.6,
  },
  dimmedOptionText: {
    color: "#94A3B8",
  },
  nextButton: {
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#3B82F6",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  disabledButton: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#F8FAFC",
    fontWeight: "900",
    fontSize: 18,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    gap: 15,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1E293B",
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
  },
  resultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1E293B",
  },
  resultsScore: {
    fontSize: 18,
    fontWeight: "500",
    color: "#64748B",
  },
  resultsPercent: {
    fontSize: 64,
    fontWeight: "900",
    color: "#3B82F6",
  },
  resultsMessage: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    textAlign: "center",
  },
});
