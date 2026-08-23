/*
 * COMPUTATIONAL MATH EXERCISE
 * ----------------------------
 * Demonstrates: algorithmic thinking applied to number theory and statistics.
 *   - isPrime(): trial division up to sqrt(n), a classic algorithm optimization
 *   - gcd()/lcm(): Euclidean algorithm, one of the oldest algorithms in existence
 *   - mean()/variance(): basic descriptive statistics over a data set
 */

#include <iostream>
#include <vector>
#include <cmath>
#include <numeric>

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= static_cast<int>(std::sqrt(n)); i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int lcm(int a, int b) {
    return (a / gcd(a, b)) * b;
}

double mean(const std::vector<double>& data) {
    double sum = std::accumulate(data.begin(), data.end(), 0.0);
    return sum / data.size();
}

double variance(const std::vector<double>& data) {
    double m = mean(data);
    double sumSquaredDiff = 0.0;
    for (double value : data) {
        sumSquaredDiff += (value - m) * (value - m);
    }
    return sumSquaredDiff / data.size();
}

int main() {
    std::cout << "=== Prime Check (2-30) ===\n";
    for (int i = 2; i <= 30; i++) {
        if (isPrime(i)) std::cout << i << " ";
    }
    std::cout << "\n\n";

    std::cout << "=== GCD / LCM ===\n";
    int a = 48, b = 18;
    std::cout << "gcd(" << a << ", " << b << ") = " << gcd(a, b) << "\n";
    std::cout << "lcm(" << a << ", " << b << ") = " << lcm(a, b) << "\n\n";

    std::cout << "=== Basic Statistics ===\n";
    std::vector<double> scores = {72.5, 88.0, 91.5, 65.0, 79.0};
    std::cout << "mean     = " << mean(scores) << "\n";
    std::cout << "variance = " << variance(scores) << "\n";

    return 0;
}
