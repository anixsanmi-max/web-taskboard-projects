/*
 * PROCEDURAL DATA FLOW EXERCISE
 * -------------------------------
 * Demonstrates: a straight-line, step-by-step data pipeline —
 *   INPUT (raw records) -> PROCESS (compute + validate) -> OUTPUT (report)
 * This is the "procedural" style: functions run in sequence, each
 * transforming data and passing it to the next stage, rather than
 * relying on objects managing their own state.
 */

#include <iostream>
#include <vector>
#include <string>
#include <iomanip>

struct StudentRecord {
    std::string name;
    std::vector<int> scores;
};

// STAGE 1: INPUT - build the raw data set
std::vector<StudentRecord> loadRecords() {
    return {
        {"Ada",    {85, 90, 78}},
        {"Chidi",  {60, 55, 70}},
        {"Fatima", {95, 92, 98}},
        {"Emeka",  {40, 45, 38}}
    };
}

// STAGE 2: PROCESS - compute an average, one record at a time
double computeAverage(const std::vector<int>& scores) {
    int sum = 0;
    for (int s : scores) sum += s;
    return static_cast<double>(sum) / scores.size();
}

// STAGE 2b: PROCESS - classify pass/fail based on a threshold
std::string classify(double average) {
    const double PASS_THRESHOLD = 50.0;
    return (average >= PASS_THRESHOLD) ? "PASS" : "FAIL";
}

// STAGE 3: OUTPUT - print a formatted report
void printReport(const std::vector<StudentRecord>& records) {
    std::cout << std::left << std::setw(10) << "Name"
              << std::setw(10) << "Average"
              << "Result\n";
    std::cout << "----------------------------\n";

    for (const auto& record : records) {
        double avg = computeAverage(record.scores);
        std::string result = classify(avg);
        std::cout << std::left << std::setw(10) << record.name
                  << std::setw(10) << std::fixed << std::setprecision(1) << avg
                  << result << "\n";
    }
}

int main() {
    // The flow: load -> (compute + classify happen inside printReport) -> report
    std::vector<StudentRecord> records = loadRecords();
    printReport(records);
    return 0;
}
