/*
 * OOP EXERCISE: Shape Hierarchy
 * ------------------------------
 * Demonstrates: classes, inheritance, virtual functions (polymorphism),
 * encapsulation, and basic geometric algorithms.
 *
 * Concept: a base "Shape" class defines a common interface (area, perimeter).
 * Each derived class implements the math for its own shape. A single loop
 * over a list of base-class pointers can then compute area/perimeter for
 * ANY shape without knowing which one it is at compile time — that's
 * the point of polymorphism.
 */

#include <iostream>
#include <vector>
#include <memory>
#include <cmath>

class Shape {
public:
    virtual double area() const = 0;       // pure virtual -> makes Shape abstract
    virtual double perimeter() const = 0;
    virtual std::string name() const = 0;
    virtual ~Shape() = default;             // virtual destructor: required whenever a class
                                             // will be deleted through a base class pointer
};

class Circle : public Shape {
private:
    double radius;
public:
    explicit Circle(double r) : radius(r) {}

    double area() const override {
        return M_PI * radius * radius;
    }
    double perimeter() const override {
        return 2 * M_PI * radius;
    }
    std::string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() const override {
        return width * height;
    }
    double perimeter() const override {
        return 2 * (width + height);
    }
    std::string name() const override { return "Rectangle"; }
};

class Triangle : public Shape {
private:
    double a, b, c; // three side lengths
public:
    Triangle(double a, double b, double c) : a(a), b(b), c(c) {}

    // Heron's formula
    double area() const override {
        double s = perimeter() / 2.0;
        return std::sqrt(s * (s - a) * (s - b) * (s - c));
    }
    double perimeter() const override {
        return a + b + c;
    }
    std::string name() const override { return "Triangle"; }
};

int main() {
    // Store different shape types together using base-class pointers.
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));
    shapes.push_back(std::make_unique<Triangle>(3.0, 4.0, 5.0));

    std::cout << "=== Shape Report ===\n";
    for (const auto& shape : shapes) {
        std::cout << shape->name()
                  << " | area = " << shape->area()
                  << " | perimeter = " << shape->perimeter() << "\n";
    }
    return 0;
}
