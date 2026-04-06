import { ModuleData } from "@/components/ModuleCard";

// Structured course modules indexed by course title keyword
// Each course has Beginner, Intermediate, Advanced levels with 5-6 modules each

const pythonModules: { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } = {
  beginner: [
    {
      title: "Introduction to Python",
      concept: "Python is a high-level, interpreted programming language known for its simplicity. It uses indentation instead of braces, making code readable.\n\nPython is used in web development, data science, AI, automation, and more.",
      realWorldExample: "Instagram, Spotify, and Netflix all use Python in their backend systems. Data scientists use Python to analyze millions of data points daily.",
      codeExample: `# Your first Python program
print("Hello, World!")

# Variables
name = "CodeClub"
age = 2
print(f"Welcome to {name}, est. {age} years ago")`,
      codeLanguage: "python",
      commonMistakes: [
        "Forgetting indentation — Python uses whitespace, not braces",
        "Using = instead of == for comparison",
        "Missing colon after if/for/while statements",
      ],
      practiceQuestions: [
        "Write a program that prints your name 5 times",
        "Create variables for your name, age, and city, then print them in a sentence",
        "What's the difference between print('5') and print(5)?",
      ],
      tryItPrompt: "Write a Python program that prints 'I love coding'",
      tryItExpectedOutput: "I love coding",
      tryItStarterCode: "# Write your code below\n",
      summary: [
        "Python uses indentation for code blocks",
        "Variables don't need type declarations",
        "print() is used to display output",
        "f-strings allow embedding variables in strings",
      ],
    },
    {
      title: "Variables and Data Types",
      concept: "Variables store data values. Python has several built-in data types:\n\n• int — whole numbers (42)\n• float — decimal numbers (3.14)\n• str — text ('hello')\n• bool — True/False\n• list — ordered collection [1, 2, 3]\n• dict — key-value pairs {'name': 'Alex'}",
      realWorldExample: "In an e-commerce app, variables store product prices (float), quantities (int), product names (str), and availability (bool).",
      codeExample: `# Different data types
price = 29.99          # float
quantity = 3           # int
product = "Laptop"     # str
in_stock = True        # bool

# Type checking
print(type(price))     # <class 'float'>

# Type conversion
age_str = "25"
age_int = int(age_str) # Convert string to int
print(age_int + 5)     # 30`,
      codeLanguage: "python",
      commonMistakes: [
        "Trying to add a string and integer: '5' + 3 causes TypeError",
        "Confusing mutable (list) and immutable (tuple) types",
        "Not knowing that Python is dynamically typed — variables can change type",
      ],
      practiceQuestions: [
        "Create variables of each data type and print their types",
        "Convert the string '100' to an integer and add 50 to it",
        "What happens when you multiply a string by 3?",
        "Create a list of 5 fruits and print the second one",
      ],
      tryItPrompt: "Create a variable 'total' that equals 10 + 20, then print it",
      tryItExpectedOutput: "30",
      tryItStarterCode: "# Calculate the total\n",
      summary: [
        "Python has int, float, str, bool, list, dict types",
        "type() reveals a variable's data type",
        "int() and str() convert between types",
        "Variables are dynamically typed in Python",
      ],
    },
    {
      title: "Operators and Expressions",
      concept: "Operators perform operations on values:\n\n• Arithmetic: +, -, *, /, //, %, **\n• Comparison: ==, !=, <, >, <=, >=\n• Logical: and, or, not\n• Assignment: =, +=, -=, *=",
      realWorldExample: "A calculator app uses arithmetic operators. A login system uses comparison operators to check passwords. Game logic uses logical operators to check multiple conditions.",
      codeExample: `# Arithmetic
print(10 / 3)   # 3.333 (float division)
print(10 // 3)  # 3 (floor division)
print(10 % 3)   # 1 (remainder)
print(2 ** 10)  # 1024 (power)

# Comparison
x = 5
print(x == 5)   # True
print(x != 3)   # True

# Logical
age = 20
has_id = True
can_enter = age >= 18 and has_id
print(can_enter)  # True`,
      codeLanguage: "python",
      commonMistakes: [
        "Using / when you need // for integer division",
        "Confusing = (assignment) with == (comparison)",
        "Operator precedence: ** > * > + (use parentheses when unsure)",
      ],
      practiceQuestions: [
        "What is 17 % 5? What does this represent?",
        "Write an expression that checks if a number is between 1 and 100",
        "What's the difference between / and //?",
      ],
      tryItPrompt: "Print the result of 2 raised to the power of 8",
      tryItExpectedOutput: "256",
      tryItStarterCode: "# Use the ** operator\n",
      summary: [
        "// is floor division, % is modulo",
        "** is the power operator",
        "Logical operators: and, or, not",
        "Use parentheses to control operator precedence",
      ],
    },
    {
      title: "Control Flow — If/Else",
      concept: "Control flow lets your program make decisions. Python uses if, elif, and else keywords.\n\nThe condition must evaluate to True or False. The code block under the matching condition runs.",
      realWorldExample: "ATM machines use if/else: if balance >= withdrawal_amount, allow withdrawal. Else, show 'Insufficient funds'. Websites check if a user is logged in to show different content.",
      codeExample: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Score: {score}, Grade: {grade}")
# Output: Score: 85, Grade: B

# Ternary operator
status = "Pass" if score >= 60 else "Fail"`,
      codeLanguage: "python",
      commonMistakes: [
        "Forgetting the colon : after if/elif/else",
        "Wrong indentation inside the if block",
        "Using elif after else — else must be last",
        "Not handling all cases (missing else)",
      ],
      practiceQuestions: [
        "Write a program that checks if a number is positive, negative, or zero",
        "Create a simple calculator using if/elif for +, -, *, /",
        "Write a program to check if a year is a leap year",
      ],
      tryItPrompt: "Write code that prints 'even' if 10 is even, 'odd' otherwise",
      tryItExpectedOutput: "even",
      tryItStarterCode: "num = 10\n# Check if even or odd\n",
      summary: [
        "if/elif/else for multi-way branching",
        "Conditions must evaluate to True/False",
        "Ternary: value_if_true if condition else value_if_false",
        "Always end conditions with a colon :",
      ],
    },
    {
      title: "Loops — For and While",
      concept: "Loops repeat code blocks:\n\n• for loop — iterates over a sequence (list, range, string)\n• while loop — repeats while a condition is True\n\nControl keywords: break (exit loop), continue (skip iteration), pass (do nothing).",
      realWorldExample: "Social media feeds use loops to render each post. Search engines loop through billions of pages. Games use while loops for the main game loop.",
      codeExample: `# For loop with range
for i in range(5):
    print(f"Iteration {i}")

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit.upper())

# While loop
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1

# Break and continue
for n in range(10):
    if n == 5:
        break
    if n % 2 == 0:
        continue
    print(n)  # Prints 1, 3`,
      codeLanguage: "python",
      commonMistakes: [
        "Infinite while loops — forgetting to update the counter",
        "Off-by-one: range(5) gives 0-4, not 1-5",
        "Modifying a list while iterating over it",
      ],
      practiceQuestions: [
        "Print all even numbers from 1 to 20",
        "Write a while loop that sums numbers until the sum exceeds 100",
        "Use a for loop to count vowels in a string",
        "Write a loop that prints a multiplication table for 7",
      ],
      tryItPrompt: "Print numbers from 1 to 5 using a for loop (each on new line)",
      tryItExpectedOutput: "1",
      tryItStarterCode: "# Use range() to loop\n",
      summary: [
        "for iterates over sequences; while checks conditions",
        "range(start, stop, step) generates number sequences",
        "break exits the loop; continue skips to next iteration",
        "Avoid infinite loops by ensuring the condition eventually becomes False",
      ],
    },
    {
      title: "Functions",
      concept: "Functions are reusable blocks of code. They take inputs (parameters), perform operations, and return outputs.\n\nDefined with 'def' keyword. Can have default parameters, *args, and **kwargs.",
      realWorldExample: "In a banking app, a function calculates interest. In a game, a function checks collision. Every 'button click' calls a function.",
      codeExample: `# Basic function
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # Hello, Alice!

# Default parameters
def power(base, exp=2):
    return base ** exp

print(power(3))     # 9
print(power(3, 3))  # 27

# Multiple return values
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([3, 1, 7, 2])
print(f"Min: {lo}, Max: {hi}")`,
      codeLanguage: "python",
      commonMistakes: [
        "Forgetting to return a value (function returns None)",
        "Mutable default arguments: def f(lst=[]) shares the same list!",
        "Not calling the function — defining it is not enough",
      ],
      practiceQuestions: [
        "Write a function that checks if a number is prime",
        "Create a function that reverses a string",
        "Write a function with default parameter for calculating area of a rectangle",
        "Create a function that returns both the sum and average of a list",
      ],
      tryItPrompt: "Write a function 'double(n)' that returns n*2, then print double(7)",
      tryItExpectedOutput: "14",
      tryItStarterCode: "def double(n):\n    # your code here\n    pass\n\nprint(double(7))",
      summary: [
        "def keyword defines functions",
        "return sends values back to the caller",
        "Default parameters have fallback values",
        "Functions make code reusable and organized",
      ],
    },
  ],
  intermediate: [
    {
      title: "Lists and List Comprehensions",
      concept: "Lists are ordered, mutable collections. List comprehensions provide a concise way to create lists.\n\nKey methods: append(), insert(), remove(), pop(), sort(), reverse(), slice().",
      realWorldExample: "A todo app stores tasks in a list. E-commerce sites use lists for shopping carts. Music apps store playlists as lists.",
      codeExample: `# List operations
nums = [3, 1, 4, 1, 5, 9]
nums.sort()
print(nums)  # [1, 1, 3, 4, 5, 9]

# Slicing
print(nums[1:4])   # [1, 3, 4]
print(nums[::-1])  # [9, 5, 4, 3, 1, 1] reversed

# List comprehension
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]`,
      codeLanguage: "python",
      commonMistakes: [
        "Index out of range — accessing index that doesn't exist",
        "sort() modifies in place and returns None",
        "Shallow copy: b = a copies reference, not values. Use b = a.copy()",
      ],
      practiceQuestions: [
        "Create a list comprehension of cubes from 1 to 10",
        "Write code to flatten a 2D list into 1D",
        "Remove all duplicates from a list preserving order",
        "Use slicing to get every third element",
      ],
      tryItPrompt: "Create a list of squares of even numbers from 2 to 10 and print it",
      tryItExpectedOutput: "[4, 16, 36, 64, 100]",
      tryItStarterCode: "# Use list comprehension\n",
      summary: [
        "Lists are mutable ordered collections",
        "Slicing: list[start:stop:step]",
        "Comprehensions: [expr for x in iterable if condition]",
        "Use .copy() to avoid unintended mutations",
      ],
    },
    {
      title: "Dictionaries and Sets",
      concept: "Dictionaries store key-value pairs. Keys must be immutable and unique. Sets store unique unordered elements.\n\nDict methods: get(), keys(), values(), items(), update()\nSet operations: union |, intersection &, difference -",
      realWorldExample: "User profiles are dictionaries (name, email, age). Databases return rows as dictionaries. Sets are used to find unique visitors to a website.",
      codeExample: `# Dictionary
student = {"name": "Alice", "age": 20, "grades": [90, 85]}
print(student.get("name"))       # Alice
print(student.get("email", "N/A")) # N/A (default)

# Dictionary comprehension
squares = {x: x**2 for x in range(6)}

# Sets
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)  # {3, 4} intersection
print(a | b)  # {1, 2, 3, 4, 5, 6} union
print(a - b)  # {1, 2} difference`,
      codeLanguage: "python",
      commonMistakes: [
        "Using mutable types (lists) as dictionary keys",
        "KeyError when accessing missing keys — use .get()",
        "Sets don't support indexing (they're unordered)",
      ],
      practiceQuestions: [
        "Count the frequency of each character in a string using a dict",
        "Find common elements between two lists using sets",
        "Merge two dictionaries",
        "Create a dict comprehension mapping names to their lengths",
      ],
      tryItPrompt: "Create a dictionary with keys 'a','b','c' and values 1,2,3, then print it",
      tryItExpectedOutput: "{'a': 1, 'b': 2, 'c': 3}",
      tryItStarterCode: "# Create your dictionary\n",
      summary: [
        "Dicts use key-value pairs; keys must be immutable",
        ".get(key, default) prevents KeyError",
        "Sets store unique values with O(1) lookup",
        "Set operations: |, &, - for union, intersection, difference",
      ],
    },
    {
      title: "String Methods and Formatting",
      concept: "Strings are immutable sequences of characters with powerful built-in methods.\n\nKey methods: split(), join(), strip(), replace(), find(), startswith(), endswith(), upper(), lower(), isdigit(), isalpha().",
      realWorldExample: "Text processing: cleaning user input (strip whitespace), parsing CSV files (split by comma), formatting receipts, validating email addresses.",
      codeExample: `text = "  Hello, World!  "
print(text.strip())          # "Hello, World!"
print(text.lower().strip())  # "hello, world!"

# Split and join
csv = "apple,banana,cherry"
fruits = csv.split(",")     # ['apple', 'banana', 'cherry']
result = " | ".join(fruits) # 'apple | banana | cherry'

# F-strings (Python 3.6+)
name, score = "Alice", 95.5
print(f"{name} scored {score:.1f}%")

# Multi-line strings
query = """
SELECT *
FROM users
WHERE age > 18
"""`,
      codeLanguage: "python",
      commonMistakes: [
        "Strings are immutable — methods return new strings, don't modify in place",
        "Forgetting that split() returns a list, not a string",
        "Index confusion: 'hello'[1] is 'e', not 'h'",
      ],
      practiceQuestions: [
        "Write a function that counts words in a sentence",
        "Check if a string is a palindrome (ignoring case and spaces)",
        "Extract the domain from an email address",
        "Convert 'hello world' to 'Hello World' (title case)",
      ],
      tryItPrompt: "Print 'hello world' in uppercase",
      tryItExpectedOutput: "HELLO WORLD",
      tryItStarterCode: "text = 'hello world'\n",
      summary: [
        "Strings are immutable — methods return new strings",
        "split() breaks strings; join() combines lists",
        "f-strings are the modern way to format strings",
        "strip() removes leading/trailing whitespace",
      ],
    },
    {
      title: "File Handling",
      concept: "Python can read and write files using the built-in open() function. The 'with' statement ensures proper file cleanup.\n\nModes: 'r' (read), 'w' (write), 'a' (append), 'rb'/'wb' (binary).",
      realWorldExample: "Log files store application events. Configuration files store app settings. Data pipelines read CSV files and write processed results.",
      codeExample: `# Writing to a file
with open("output.txt", "w") as f:
    f.write("Line 1\\n")
    f.write("Line 2\\n")

# Reading a file
with open("output.txt", "r") as f:
    content = f.read()
    print(content)

# Reading line by line (memory efficient)
with open("output.txt", "r") as f:
    for line in f:
        print(line.strip())

# CSV processing
import csv
with open("data.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["score"])`,
      codeLanguage: "python",
      commonMistakes: [
        "Not using 'with' — file may not close properly",
        "'w' mode overwrites the file! Use 'a' to append",
        "FileNotFoundError — check the file path",
        "Not handling encoding: open('file.txt', encoding='utf-8')",
      ],
      practiceQuestions: [
        "Write a program that counts lines in a file",
        "Create a program that appends timestamps to a log file",
        "Read a CSV file and compute the average of a numeric column",
      ],
      tryItPrompt: "Print the string 'file handling works'",
      tryItExpectedOutput: "file handling works",
      tryItStarterCode: "# Demonstrate your understanding\n",
      summary: [
        "Always use 'with' for automatic file cleanup",
        "'r' reads, 'w' overwrites, 'a' appends",
        "Iterate over file object for memory-efficient reading",
        "Use csv module for structured data",
      ],
    },
    {
      title: "Error Handling",
      concept: "Exceptions are runtime errors. Python uses try/except/finally to handle them gracefully.\n\nCommon exceptions: ValueError, TypeError, KeyError, IndexError, FileNotFoundError, ZeroDivisionError.",
      realWorldExample: "Web APIs handle errors gracefully — returning 404 for missing resources instead of crashing. Payment systems catch errors to prevent double charges.",
      codeExample: `# Basic try/except
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Multiple exceptions
try:
    num = int(input("Enter a number: "))
    result = 100 / num
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("This always runs")

# Custom exceptions
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.message = f"Cannot withdraw {amount}. Balance: {balance}"
        super().__init__(self.message)`,
      codeLanguage: "python",
      commonMistakes: [
        "Catching all exceptions with bare 'except:' — hides bugs",
        "Not being specific enough with exception types",
        "Forgetting that finally always runs, even after return",
      ],
      practiceQuestions: [
        "Write a safe division function that handles ZeroDivisionError",
        "Create an input validator that keeps asking until valid input",
        "Write a custom exception for a password that's too short",
      ],
      tryItPrompt: "Print 'error caught' (simulating exception handling)",
      tryItExpectedOutput: "error caught",
      tryItStarterCode: "try:\n    x = 1/0\nexcept:\n    # print here\n    pass\n",
      summary: [
        "try/except catches runtime errors",
        "Be specific with exception types",
        "finally always runs (cleanup code)",
        "Create custom exceptions with class inheritance",
      ],
    },
  ],
  advanced: [
    {
      title: "Object-Oriented Programming",
      concept: "OOP organizes code into classes (blueprints) and objects (instances). Four pillars:\n\n1. Encapsulation — bundling data and methods\n2. Inheritance — creating child classes\n3. Polymorphism — same interface, different behavior\n4. Abstraction — hiding implementation details",
      realWorldExample: "In a game, each character is an object with health, attack, and defend methods. E-commerce: Product, Cart, Order are all classes.",
      codeExample: `class Animal:
    def __init__(self, name, sound):
        self.name = name
        self._sound = sound  # protected
    
    def speak(self):
        return f"{self.name} says {self._sound}"

class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, "Woof")
    
    def fetch(self, item):
        return f"{self.name} fetches {item}!"

# Usage
dog = Dog("Buddy")
print(dog.speak())        # Buddy says Woof
print(dog.fetch("ball"))  # Buddy fetches ball!`,
      codeLanguage: "python",
      commonMistakes: [
        "Forgetting self in method definitions",
        "Not calling super().__init__() in child classes",
        "Confusing class variables (shared) with instance variables",
      ],
      practiceQuestions: [
        "Create a BankAccount class with deposit, withdraw, and balance methods",
        "Implement inheritance: Shape → Circle, Rectangle",
        "Use __str__ to make objects printable",
        "Create a Student class that tracks grades and computes GPA",
      ],
      tryItPrompt: "Print 'OOP works' to confirm understanding",
      tryItExpectedOutput: "OOP works",
      tryItStarterCode: "# Confirm your understanding\n",
      summary: [
        "__init__ is the constructor; self refers to the instance",
        "Inheritance: class Child(Parent)",
        "super() calls parent class methods",
        "Use _ prefix for protected, __ for private attributes",
      ],
    },
    {
      title: "Decorators and Generators",
      concept: "Decorators modify function behavior without changing the function itself. Generators produce values lazily using yield.\n\nDecorators: @decorator_name above a function\nGenerators: functions with yield instead of return",
      realWorldExample: "Web frameworks use @login_required decorators. @cache decorators speed up repeated function calls. Generators handle large datasets without loading everything into memory.",
      codeExample: `# Decorator
import time
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time()-start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

# Generator
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num, end=" ")
# 0 1 1 2 3 5 8 13 21 34`,
      codeLanguage: "python",
      commonMistakes: [
        "Forgetting @wraps(func) — losing function metadata",
        "Confusing yield (generator) with return (regular function)",
        "Generator exhaustion — can only iterate once",
      ],
      practiceQuestions: [
        "Write a @retry decorator that retries a function 3 times on failure",
        "Create a generator that yields prime numbers",
        "Write a @cache decorator for memoization",
      ],
      tryItPrompt: "Print 'generators rock'",
      tryItExpectedOutput: "generators rock",
      tryItStarterCode: "",
      summary: [
        "Decorators wrap functions to add behavior",
        "yield makes a function a generator (lazy evaluation)",
        "Generators save memory for large sequences",
        "@wraps preserves decorated function metadata",
      ],
    },
    {
      title: "Lambda, Map, Filter, Reduce",
      concept: "Functional programming tools in Python:\n\n• lambda — anonymous inline functions\n• map() — apply function to each element\n• filter() — keep elements that pass a test\n• reduce() — accumulate values into one result",
      realWorldExample: "Data pipelines: map to transform records, filter to remove invalid ones, reduce to aggregate totals. Used heavily in Spark/Pandas.",
      codeExample: `# Lambda
square = lambda x: x ** 2
print(square(5))  # 25

# Map
nums = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, nums))
print(squared)  # [1, 4, 9, 16, 25]

# Filter
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)  # [2, 4]

# Reduce
from functools import reduce
total = reduce(lambda a, b: a + b, nums)
print(total)  # 15`,
      codeLanguage: "python",
      commonMistakes: [
        "Lambda can only contain one expression, not statements",
        "Overusing lambda makes code hard to read",
        "map/filter return iterators — wrap in list() to see results",
      ],
      practiceQuestions: [
        "Use map to convert a list of temperatures from Celsius to Fahrenheit",
        "Use filter to get all strings longer than 5 characters",
        "Use reduce to find the product of all numbers in a list",
      ],
      tryItPrompt: "Print the result of applying lambda x: x*3 to the value 5",
      tryItExpectedOutput: "15",
      tryItStarterCode: "f = lambda x: x * 3\n",
      summary: [
        "lambda creates small anonymous functions",
        "map applies a function to every element",
        "filter keeps elements passing a condition",
        "reduce accumulates into a single value",
      ],
    },
    {
      title: "Concurrency — Threading & Async",
      concept: "Concurrency runs multiple tasks apparently simultaneously.\n\n• Threading — for I/O-bound tasks (network, file)\n• asyncio — modern async/await syntax\n• multiprocessing — for CPU-bound tasks (true parallelism)",
      realWorldExample: "Web servers handle thousands of requests concurrently. Download managers fetch multiple files simultaneously. Chat apps handle multiple conversations at once.",
      codeExample: `# Threading
import threading

def download(url):
    print(f"Downloading {url}...")
    # simulated work
    print(f"Done: {url}")

threads = [threading.Thread(target=download, args=(f"file_{i}",)) for i in range(3)]
for t in threads: t.start()
for t in threads: t.join()

# Async/Await
import asyncio

async def fetch_data(name, delay):
    await asyncio.sleep(delay)
    return f"{name} loaded"

async def main():
    results = await asyncio.gather(
        fetch_data("users", 1),
        fetch_data("posts", 2),
    )
    print(results)`,
      codeLanguage: "python",
      commonMistakes: [
        "GIL prevents true parallel execution in threading",
        "Race conditions when threads share mutable data",
        "Forgetting to await async functions",
        "Mixing sync and async code incorrectly",
      ],
      practiceQuestions: [
        "Write a threaded program that downloads 5 URLs concurrently",
        "Create an async function that fetches data from 3 APIs",
        "Explain when to use threading vs multiprocessing",
      ],
      tryItPrompt: "Print 'async ready'",
      tryItExpectedOutput: "async ready",
      tryItStarterCode: "",
      summary: [
        "Threading for I/O-bound tasks",
        "asyncio for modern concurrent code",
        "multiprocessing for CPU-bound work",
        "GIL limits threading for CPU tasks",
      ],
    },
    {
      title: "Mini Project: CLI Task Manager",
      concept: "Build a command-line task manager that combines all Python concepts: file I/O, OOP, error handling, data structures.\n\nFeatures: Add, complete, delete, list tasks. Save to JSON file.",
      realWorldExample: "Project management tools like Todoist started as simple task managers. This project teaches full-stack Python skills.",
      codeExample: `import json
import os

class TaskManager:
    def __init__(self, filepath="tasks.json"):
        self.filepath = filepath
        self.tasks = self._load()
    
    def _load(self):
        if os.path.exists(self.filepath):
            with open(self.filepath) as f:
                return json.load(f)
        return []
    
    def _save(self):
        with open(self.filepath, "w") as f:
            json.dump(self.tasks, f, indent=2)
    
    def add(self, title):
        task = {"id": len(self.tasks)+1, "title": title, "done": False}
        self.tasks.append(task)
        self._save()
        return task
    
    def complete(self, task_id):
        for t in self.tasks:
            if t["id"] == task_id:
                t["done"] = True
                self._save()
                return True
        return False

# Usage
mgr = TaskManager()
mgr.add("Learn Python OOP")
mgr.add("Build a project")
mgr.complete(1)
print(mgr.tasks)`,
      codeLanguage: "python",
      practiceQuestions: [
        "Add a delete_task method",
        "Add a search function that finds tasks by keyword",
        "Add due dates and sorting by date",
        "Add colored output using ANSI codes",
      ],
      tryItPrompt: "Print 'project complete'",
      tryItExpectedOutput: "project complete",
      tryItStarterCode: "",
      summary: [
        "Combine OOP, file I/O, and data structures in real projects",
        "JSON is great for simple data persistence",
        "Always handle errors gracefully in user-facing apps",
        "Start simple, then add features incrementally",
      ],
    },
  ],
};

// Generate a generic set of modules for courses that don't have custom content
function generateGenericModules(courseTitle: string): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } {
  const topic = courseTitle.toLowerCase();
  return {
    beginner: [
      {
        title: `Introduction to ${courseTitle}`,
        concept: `${courseTitle} is a fundamental area of computer science and software development. This module introduces the core concepts, history, and importance of ${courseTitle}.\n\nWe'll cover why this topic matters, who uses it, and how it fits into the larger programming ecosystem.`,
        realWorldExample: `${courseTitle} concepts are used by companies like Google, Amazon, and Microsoft in their products and services. Understanding these fundamentals is essential for technical interviews and real-world development.`,
        codeExample: `# ${courseTitle} — Getting Started\n# This is your first step into ${courseTitle}\nprint("Welcome to ${courseTitle}!")\nprint("Let's begin learning step by step")`,
        codeLanguage: "python",
        commonMistakes: ["Trying to learn everything at once — focus on fundamentals first", "Not practicing enough — reading alone isn't sufficient", "Skipping basics to jump to advanced topics"],
        practiceQuestions: ["What is ${courseTitle} and why is it important?", "List 3 real-world applications of ${courseTitle}", "What prerequisites do you need for ${courseTitle}?"],
        tryItPrompt: `Print 'I am learning ${courseTitle}'`,
        tryItExpectedOutput: `I am learning ${courseTitle}`,
        tryItStarterCode: "",
        summary: [`${courseTitle} is widely used in industry`, "Start with fundamentals before advanced topics", "Practice is key to mastery"],
      },
    ],
    intermediate: [
      {
        title: `${courseTitle} — Core Patterns`,
        concept: `Now that you understand the basics, let's explore core patterns and best practices in ${courseTitle}.\n\nThis module covers intermediate techniques that professional developers use daily.`,
        realWorldExample: `These patterns are used in production codebases at scale. Understanding them is crucial for writing maintainable, efficient code.`,
        codeExample: `# Intermediate ${courseTitle} patterns\n# Apply what you've learned\nprint("Practicing core patterns")`,
        codeLanguage: "python",
        practiceQuestions: ["Implement a solution using the patterns learned", "Compare two approaches and analyze trade-offs", "Refactor a basic solution to use best practices"],
        tryItPrompt: "Print 'patterns mastered'",
        tryItExpectedOutput: "patterns mastered",
        tryItStarterCode: "",
        summary: ["Patterns make code more maintainable", "Always consider trade-offs", "Practice refactoring existing code"],
      },
    ],
    advanced: [
      {
        title: `${courseTitle} — Advanced Techniques`,
        concept: `Advanced ${courseTitle} covers optimization, design patterns, and real-world system design.\n\nThis module prepares you for senior-level challenges and interviews.`,
        realWorldExample: `Senior engineers at top tech companies apply these techniques to build systems serving millions of users.`,
        codeExample: `# Advanced ${courseTitle}\n# Optimization and design\nprint("Advanced level reached!")`,
        codeLanguage: "python",
        practiceQuestions: ["Design a system using advanced concepts", "Optimize a solution for time and space complexity", "Compare your approach with industry standards"],
        tryItPrompt: "Print 'advanced complete'",
        tryItExpectedOutput: "advanced complete",
        tryItStarterCode: "",
        summary: ["Optimization matters at scale", "System design requires holistic thinking", "Keep learning and building"],
      },
    ],
  };
}

// Map of course title keywords to their modules
const courseModulesMap: Record<string, { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] }> = {
  "python": pythonModules,
};

// Deep content generators for major courses
function generateJavaScriptModules(): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } {
  return {
    beginner: [
      { title: "Introduction to JavaScript", concept: "JavaScript is the language of the web. It runs in browsers and servers (Node.js).\n\n• Created by Brendan Eich in 1995\n• The only language that runs natively in browsers\n• Dynamically typed, prototype-based, multi-paradigm\n• Used for frontend, backend, mobile, and desktop", realWorldExample: "Every website uses JavaScript. Gmail, Google Maps, Twitter, Netflix — all powered by JS. Node.js enables server-side JS powering LinkedIn, PayPal, and Uber.", codeExample: 'console.log("Hello, JavaScript!");\n\nlet name = "CodeClub";\nconst version = 2.0;\nconsole.log(`Welcome to ${name} v${version}`);\n\nconsole.log(typeof 42);        // "number"\nconsole.log(typeof "hello");   // "string"\nconsole.log(typeof true);      // "boolean"', codeLanguage: "javascript", commonMistakes: ["Using var instead of let/const", "Confusing == with === equality", "Not understanding hoisting"], practiceQuestions: ["Print 'Hello World' using console.log", "Declare variables using let and const", "What's the difference between let, const, and var?", "Use template literals to create a greeting"], tryItPrompt: "Print 'JS rocks' using console.log", tryItExpectedOutput: "JS rocks", tryItStarterCode: 'console.log("JS rocks");', summary: ["Use let for variables, const for constants", "Template literals: `${variable}`", "typeof checks data type", "Avoid var — use let and const"] },
      { title: "Control Flow and Loops", concept: "Control flow directs program execution:\n\n• if/else if/else — conditional branching\n• switch — multi-case matching\n• for loop — count-based iteration\n• while/do-while — condition-based\n• for...of — iterate arrays\n• for...in — iterate object keys", realWorldExample: "Form validation uses conditionals. E-commerce sorting uses loops. Game loops update 60 frames per second.", codeExample: 'const score = 85;\nif (score >= 90) console.log("A");\nelse if (score >= 80) console.log("B");\nelse console.log("C");\n\nconst fruits = ["apple", "banana", "cherry"];\nfor (const fruit of fruits) {\n    console.log(fruit.toUpperCase());\n}\n\nconst status = score >= 60 ? "Pass" : "Fail";\nconsole.log(status);', codeLanguage: "javascript", commonMistakes: ["Using = instead of ===", "Off-by-one in for loops", "Forgetting break in switch", "Infinite while loops"], practiceQuestions: ["Write FizzBuzz for 1-30", "Find max in an array using a loop", "Use switch for day name lookup", "Find first power of 2 above 1000"], tryItPrompt: "Print 'pass' if 75 >= 60, else 'fail'", tryItExpectedOutput: "pass", tryItStarterCode: 'console.log(75 >= 60 ? "pass" : "fail");', summary: ["Use === for strict equality", "for...of iterates values", "Ternary: condition ? true : false", "Always use break in switch"] },
      { title: "Functions and Scope", concept: "Functions are fundamental in JavaScript:\n\n• Function declaration: function name() {}\n• Arrow function: const name = () => {}\n• Default values, rest parameters\n• Scope: global, function, block\n• Closures: functions remember outer scope", realWorldExample: "Event handlers are functions. API calls use callbacks. React components are functions that return UI.", codeExample: 'const add = (a, b) => a + b;\nconst greet = (name = "World") => `Hello, ${name}!`;\nconsole.log(add(3, 4));       // 7\nconsole.log(greet("Alice"));  // Hello, Alice!\n\nfunction counter() {\n    let count = 0;\n    return { increment: () => ++count, getCount: () => count };\n}\nconst c = counter();\nc.increment(); c.increment();\nconsole.log(c.getCount()); // 2', codeLanguage: "javascript", commonMistakes: ["Arrow functions don't have their own 'this'", "Forgetting return in multi-line arrows", "Variable shadowing"], practiceQuestions: ["Write an arrow function for factorial", "Create a closure-based private counter", "Implement a higher-order function"], tryItPrompt: "Print result of arrow add(5, 3)", tryItExpectedOutput: "8", tryItStarterCode: "const add = (a, b) => a + b;\nconsole.log(add(5, 3));", summary: ["Arrow functions: (args) => expression", "let/const have block scope", "Closures capture outer variables", "Default params: (x = 10) =>"] },
      { title: "Arrays and Objects", concept: "Arrays and objects are core data structures:\n\n• Arrays: ordered with map, filter, reduce, find\n• Objects: key-value pairs\n• Destructuring extracts values\n• Spread operator ... copies/merges", realWorldExample: "Todo apps store tasks in arrays. User profiles are objects. E-commerce filters use array.filter().", codeExample: 'const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst sum = nums.reduce((acc, n) => acc + n, 0);\nconsole.log(doubled); // [2,4,6,8,10]\nconsole.log(sum);     // 15\n\nconst user = { name: "Alice", age: 25 };\nconst { name, ...rest } = user;\nconst merged = { ...user, city: "NYC" };', codeLanguage: "javascript", commonMistakes: ["Mutating arrays when immutability needed", "Confusing find vs filter", "No initial value in reduce"], practiceQuestions: ["Use reduce to sum an array", "Flatten a 2D array", "Swap two variables with destructuring"], tryItPrompt: "Print sum of [10,20,30] using reduce", tryItExpectedOutput: "60", tryItStarterCode: "console.log([10, 20, 30].reduce((a, b) => a + b, 0));", summary: ["map transforms, filter selects, reduce aggregates", "Destructuring: const {a, b} = obj", "Spread: [...arr] or {...obj}", "find returns first match, filter returns all"] },
      { title: "Async JavaScript — Promises and Async/Await", concept: "JavaScript handles async operations with:\n\n• Promises — .then()/.catch() chains\n• Async/Await — cleaner promise syntax\n• fetch() — built-in HTTP client\n• Promise.all for parallel requests\n\nJavaScript is single-threaded but non-blocking.", realWorldExample: "API calls fetch data from servers. File uploads are async. Real-time features use WebSockets.", codeExample: 'async function getUser(id) {\n    try {\n        const response = await fetch(`/api/users/${id}`);\n        if (!response.ok) throw new Error("Not found");\n        return await response.json();\n    } catch (error) {\n        console.error("Failed:", error.message);\n    }\n}\n\n// Parallel requests\nconst [users, posts] = await Promise.all([\n    fetch("/api/users").then(r => r.json()),\n    fetch("/api/posts").then(r => r.json()),\n]);', codeLanguage: "javascript", commonMistakes: ["Forgetting await", "Not handling rejections", "Sequential awaits when parallel is better"], practiceQuestions: ["Fetch data from a public API", "Implement retry logic for failed calls", "Use Promise.all for 3 endpoints"], tryItPrompt: "Print 'async done'", tryItExpectedOutput: "async done", tryItStarterCode: 'console.log("async done");', summary: ["async/await is sugar over Promises", "Always use try/catch with await", "Promise.all runs in parallel", "fetch() returns a Promise"] },
      { title: "DOM Manipulation", concept: "The DOM represents HTML as a tree:\n\n• querySelector() selects elements\n• textContent, innerHTML modify content\n• addEventListener() handles events\n• classList manages CSS classes\n• createElement() builds elements dynamically", realWorldExample: "Interactive forms validate in real-time. Image galleries switch photos. Shopping carts update quantities. Infinite scroll loads content.", codeExample: 'const btn = document.querySelector("#myButton");\nbtn.addEventListener("click", () => {\n    const output = document.querySelector("#output");\n    output.textContent = "Clicked!";\n    output.classList.add("active");\n});\n\n// Create elements dynamically\nconst list = document.querySelector("#list");\n["HTML", "CSS", "JS"].forEach(item => {\n    const li = document.createElement("li");\n    li.textContent = item;\n    list.appendChild(li);\n});', codeLanguage: "javascript", commonMistakes: ["innerHTML with user input (XSS)", "Querying DOM repeatedly", "Not understanding event bubbling"], practiceQuestions: ["Build a dark/light mode toggle", "Create a character counter for textarea", "Build a dynamic todo list"], tryItPrompt: "Print 'DOM ready'", tryItExpectedOutput: "DOM ready", tryItStarterCode: 'console.log("DOM ready");', summary: ["querySelector selects by CSS selector", "addEventListener handles interactions", "Use textContent over innerHTML", "Event delegation: one handler for many"] },
      { title: "ES6+ Modern Features", concept: "Modern JavaScript features:\n\n• Optional chaining (?.) and nullish coalescing (??)\n• Map and Set data structures\n• Modules (import/export)\n• Symbol, WeakMap, WeakSet\n• Destructuring, spread/rest operators", realWorldExample: "React uses ES6+ extensively. TypeScript extends ES6+. Modern build tools bundle ES6+ modules.", codeExample: 'const user = { profile: { name: "Alice" } };\nconsole.log(user.profile?.name);     // "Alice"\nconsole.log(user.settings?.theme);   // undefined\nconst theme = user.settings?.theme ?? "dark";\n\nconst cache = new Map();\ncache.set("key1", "value1");\n\nconst unique = new Set([1, 2, 2, 3]);\nconsole.log([...unique]); // [1, 2, 3]', codeLanguage: "javascript", commonMistakes: ["Confusing ?? with ||", "Using Map when plain object suffices", "Not understanding module scope"], practiceQuestions: ["Use optional chaining safely", "Implement a cache with Map", "Deduplicate array with Set"], tryItPrompt: "Print 'modern js'", tryItExpectedOutput: "modern js", tryItStarterCode: 'console.log("modern js");', summary: ["?. safely accesses nested props", "?? returns right only if left is null/undefined", "Map: any-type keys, Set: unique values", "import/export for modules"] },
    ],
    intermediate: [
      { title: "Advanced Patterns and Performance", concept: "Advanced JavaScript patterns:\n\n• Closures and IIFE\n• Proxy and Reflect for metaprogramming\n• Debounce and throttle for performance\n• Web Workers for parallel computation\n• Service Workers for offline capability", realWorldExample: "Vue.js reactivity uses Proxy. Google Docs uses Web Workers. PWAs use Service Workers. Twitter uses virtual scrolling.", codeExample: 'function debounce(fn, delay) {\n    let timer;\n    return function(...args) {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn.apply(this, args), delay);\n    };\n}\n\nconst reactive = new Proxy({}, {\n    set(target, prop, value) {\n        console.log(`${prop} changed to ${value}`);\n        target[prop] = value;\n        return true;\n    }\n});\nreactive.name = "Alice";', codeLanguage: "javascript", commonMistakes: ["Memory leaks from closures", "Overusing Proxy", "Debounce vs throttle confusion"], practiceQuestions: ["Implement throttle function", "Create reactive state with Proxy", "Build memoization with cache eviction"], tryItPrompt: "Print 'advanced js'", tryItExpectedOutput: "advanced js", tryItStarterCode: 'console.log("advanced js");', summary: ["Debounce delays until pause", "Throttle limits frequency", "Proxy intercepts operations", "Web Workers run in background"] },
    ],
    advanced: [],
  };
}

function generateJavaModules(): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } {
  return {
    beginner: [
      { title: "Introduction to Java", concept: "Java is a statically-typed, object-oriented language:\n\n• Write Once, Run Anywhere via JVM\n• Strongly typed with declared types\n• Used for enterprise, Android, web servers\n• Verbose but type-safe and performant", realWorldExample: "Android apps, banking systems (JPMorgan), Minecraft, Apache Kafka, Elasticsearch — all Java.", codeExample: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        String name = "CodeClub";\n        int age = 2;\n        double gpa = 3.9;\n        boolean active = true;\n        System.out.printf("Welcome to %s, age %d%n", name, age);\n    }\n}', codeLanguage: "java", commonMistakes: ["Forgetting semicolons", "Class name must match filename", "main method signature must be exact"], practiceQuestions: ["Create a program that prints your info", "Declare all primitive types", "Calculate area of a rectangle"], tryItPrompt: "Print 'Hello Java'", tryItExpectedOutput: "Hello Java", tryItStarterCode: 'System.out.println("Hello Java");', summary: ["Java is statically typed", "main() is the entry point", "System.out.println() prints", "Every file has one public class"] },
      { title: "Control Flow in Java", concept: "Java control flow:\n\n• if/else if/else\n• switch (enhanced in Java 14+)\n• for loop, enhanced for-each\n• while and do-while\n• break, continue", realWorldExample: "Android navigation uses conditionals. Game AI uses switch. Batch processing uses loops.", codeExample: 'int score = 85;\nif (score >= 90) System.out.println("A");\nelse if (score >= 80) System.out.println("B");\nelse System.out.println("C");\n\nString[] fruits = {"apple", "banana"};\nfor (String fruit : fruits) {\n    System.out.println(fruit.toUpperCase());\n}', codeLanguage: "java", commonMistakes: ["Missing break in switch", "Using == for strings (use .equals())", "Off-by-one errors"], practiceQuestions: ["Check if year is leap year", "Implement FizzBuzz", "Find primes up to 100"], tryItPrompt: "Print 'control flow'", tryItExpectedOutput: "control flow", tryItStarterCode: 'System.out.println("control flow");', summary: ["Use .equals() for strings", "Enhanced for: for (Type x : collection)", "Switch expressions don't need break", "do-while executes at least once"] },
      { title: "Methods and OOP Basics", concept: "Java is object-oriented:\n\n• Methods are functions inside classes\n• Access modifiers: public, private, protected\n• Constructors initialize objects\n• this keyword, method overloading\n• static members belong to the class", realWorldExample: "Spring Boot uses OOP extensively. Android Activities are classes. Design patterns are fundamental to Java.", codeExample: 'public class Student {\n    private String name;\n    private double gpa;\n\n    public Student(String name) {\n        this.name = name;\n        this.gpa = 0.0;\n    }\n\n    public void updateGPA(double gpa) {\n        if (gpa >= 0 && gpa <= 4.0) this.gpa = gpa;\n    }\n\n    public String toString() {\n        return name + " (GPA: " + gpa + ")";\n    }\n}', codeLanguage: "java", commonMistakes: ["Forgetting this for field access", "Making everything public", "Not overriding toString()"], practiceQuestions: ["Create a BankAccount class", "Implement method overloading", "Build a Calculator class"], tryItPrompt: "Print 'oop basics'", tryItExpectedOutput: "oop basics", tryItStarterCode: 'System.out.println("oop basics");', summary: ["Access modifiers control visibility", "Constructors initialize objects", "this refers to current instance", "static belongs to class"] },
      { title: "Collections Framework", concept: "Java Collections:\n\n• ArrayList — dynamic array\n• HashMap — key-value pairs\n• HashSet — unique elements\n• LinkedList, Queue, Stack\n• Stream API for functional operations", realWorldExample: "DB results in ArrayLists. Caches use HashMaps. Sessions track IDs with HashSets.", codeExample: 'List<String> names = new ArrayList<>();\nnames.add("Alice"); names.add("Bob");\nnames.sort(Comparator.naturalOrder());\n\nMap<String, Integer> scores = new HashMap<>();\nscores.put("Alice", 95);\nfor (var entry : scores.entrySet()) {\n    System.out.printf("%s: %d%n", entry.getKey(), entry.getValue());\n}\n\nlong high = scores.values().stream().filter(s -> s > 90).count();', codeLanguage: "java", commonMistakes: ["Raw types instead of generics", "ConcurrentModificationException", "Wrong equals/hashCode"], practiceQuestions: ["Sort students by GPA", "Frequency counter with HashMap", "Find duplicates with HashSet"], tryItPrompt: "Print 'collections'", tryItExpectedOutput: "collections", tryItStarterCode: 'System.out.println("collections");', summary: ["ArrayList for dynamic arrays", "HashMap for key-value lookup", "HashSet for unique elements", "Stream API for functional operations"] },
    ],
    intermediate: [
      { title: "Exception Handling and Generics", concept: "Java exceptions and generics:\n\n• try-catch-finally, try-with-resources\n• Checked vs unchecked exceptions\n• Custom exceptions\n• Generic classes and methods\n• Bounded types and wildcards", realWorldExample: "DB connections use try-with-resources. HTTP clients handle timeouts. Generic collections enforce type safety.", codeExample: 'try (var reader = new BufferedReader(new FileReader("data.txt"))) {\n    String line;\n    while ((line = reader.readLine()) != null) System.out.println(line);\n} catch (IOException e) {\n    System.err.println("Error: " + e.getMessage());\n}\n\npublic class Box<T> {\n    private T value;\n    public Box(T value) { this.value = value; }\n    public T getValue() { return value; }\n}', codeLanguage: "java", commonMistakes: ["Catching Exception instead of specifics", "Empty catch blocks", "Raw types losing safety"], practiceQuestions: ["Create custom InsufficientBalanceException", "Implement generic Stack<T>", "Handle multiple exception types"], tryItPrompt: "Print 'generics work'", tryItExpectedOutput: "generics work", tryItStarterCode: 'System.out.println("generics work");', summary: ["Checked exceptions must be caught", "try-with-resources auto-closes", "Generics provide type safety", "Wildcards: ? for unknown types"] },
      { title: "Multithreading", concept: "Java concurrency:\n\n• Thread and Runnable\n• ExecutorService for thread pools\n• synchronized for mutual exclusion\n• CompletableFuture for async\n• Concurrent collections", realWorldExample: "Web servers handle concurrent requests. Trading systems need low-latency concurrency.", codeExample: 'CompletableFuture<String> future = CompletableFuture\n    .supplyAsync(() -> "User Data")\n    .thenApply(String::toUpperCase)\n    .thenApply(data -> "Processed: " + data);\nfuture.thenAccept(System.out::println);\n\nExecutorService executor = Executors.newFixedThreadPool(4);\nfor (int i = 0; i < 10; i++) {\n    int id = i;\n    executor.submit(() -> System.out.printf("Task %d%n", id));\n}\nexecutor.shutdown();', codeLanguage: "java", commonMistakes: ["Race conditions", "Deadlocks", "Not shutting down ExecutorService"], practiceQuestions: ["Producer-consumer with BlockingQueue", "Chain CompletableFuture operations", "Thread-safe counter with AtomicInteger"], tryItPrompt: "Print 'concurrent'", tryItExpectedOutput: "concurrent", tryItStarterCode: 'System.out.println("concurrent");', summary: ["ExecutorService manages pools", "CompletableFuture for async", "synchronized prevents races", "Use concurrent collections"] },
    ],
    advanced: [],
  };
}

function generateDSAModules(): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } {
  return {
    beginner: [
      { title: "Arrays — Fundamentals", concept: "Arrays are contiguous memory storing same-type elements:\n\n• O(1) random access, O(n) insert/delete\n• Key techniques: two pointers, sliding window, prefix sums\n• Foundation for most data structures", realWorldExample: "Image pixels are 2D arrays. Audio samples, database rows, neural network weights — all arrays.", codeExample: '# Two Sum\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1]', codeLanguage: "python", commonMistakes: ["Off-by-one errors", "Not handling empty arrays", "O(n²) when O(n) hash exists"], practiceQuestions: ["Kadane's max subarray sum", "Rotate array by k", "Merge two sorted arrays", "Find missing number 1-n", "Remove duplicates in-place"], tryItPrompt: "Print sum of [1,2,3,4,5]", tryItExpectedOutput: "15", tryItStarterCode: "print(sum([1, 2, 3, 4, 5]))", summary: ["O(1) access, O(n) insert/delete", "Two pointers for sorted arrays", "Prefix sums for range queries", "Hash maps: O(n²) → O(n)"] },
      { title: "Strings — Pattern Matching", concept: "Strings are character sequences:\n\n• Immutable in Python/Java\n• Palindrome, anagram, pattern matching\n• Key: many string problems reduce to array/hash problems", realWorldExample: "Search engines match queries. DNA sequencing matches patterns. Compilers parse source code strings.", codeExample: 'def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    l, r = 0, len(s) - 1\n    while l < r:\n        if s[l] != s[r]: return False\n        l += 1; r -= 1\n    return True\n\ndef is_anagram(s1, s2):\n    from collections import Counter\n    return Counter(s1.lower()) == Counter(s2.lower())\n\nprint(is_palindrome("racecar"))  # True\nprint(is_anagram("listen", "silent"))  # True', codeLanguage: "python", commonMistakes: ["Not handling empty strings", "Case sensitivity", "String concat in loops O(n²)"], practiceQuestions: ["Reverse string without builtin", "Check anagrams", "Longest common prefix", "String compression aabcc→a2b1c2"], tryItPrompt: "Print 'palindrome' reversed", tryItExpectedOutput: "emordnilap", tryItStarterCode: 'print("palindrome"[::-1])', summary: ["Two pointers for palindromes", "Counter for anagram detection", "Slicing: s[start:stop:step]", "Join > + for concatenation"] },
      { title: "Linked Lists", concept: "Linked lists store elements in connected nodes:\n\n• Singly/doubly linked\n• O(1) insert/delete at known position, O(n) access\n• Key: fast/slow pointers, dummy head, in-place reversal", realWorldExample: "Browser history, music playlists, memory allocation free lists, undo/redo.", codeExample: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\n\ndef reverse_list(head):\n    prev = None; curr = head\n    while curr:\n        next_n = curr.next\n        curr.next = prev\n        prev = curr; curr = next_n\n    return prev\n\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next; fast = fast.next.next\n        if slow == fast: return True\n    return False', codeLanguage: "python", commonMistakes: ["Losing references during reversal", "Not handling empty list", "Creating cycles accidentally"], practiceQuestions: ["Reverse iteratively and recursively", "Detect cycle", "Find middle with slow/fast", "Merge two sorted lists", "Remove nth from end"], tryItPrompt: "Print 'linked list'", tryItExpectedOutput: "linked list", tryItStarterCode: 'print("linked list")', summary: ["Nodes: value + next pointer", "Fast/slow detects cycles", "Dummy head simplifies edges", "O(1) insert vs O(n) access"] },
      { title: "Stacks and Queues", concept: "Stack (LIFO) and Queue (FIFO):\n\n• Stack: push, pop, peek\n• Queue: enqueue, dequeue\n• Deque: double-ended\n• Priority Queue: ordered by priority", realWorldExample: "Browser back = stack. Print queue = FIFO. Task scheduling = priority queue. BFS = queue.", codeExample: 'def is_balanced(s):\n    stack = []\n    pairs = {")": "(", "]": "[", "}": "{"}\n    for c in s:\n        if c in "([{": stack.append(c)\n        elif c in ")]}":\n            if not stack or stack[-1] != pairs[c]: return False\n            stack.pop()\n    return len(stack) == 0\n\nprint(is_balanced("({[]})"))  # True\nprint(is_balanced("([)]"))   # False', codeLanguage: "python", commonMistakes: ["Stack overflow from recursion", "List for queue (use deque)", "Not checking empty before pop"], practiceQuestions: ["Min stack in O(1)", "Evaluate postfix expression", "Queue using two stacks", "Monotonic stack: next greater element"], tryItPrompt: "Print 'stack works'", tryItExpectedOutput: "stack works", tryItStarterCode: 'print("stack works")', summary: ["Stack: LIFO push/pop", "Queue: FIFO add/remove", "deque for O(1) queue ops", "Monotonic stack for next greater/smaller"] },
    ],
    intermediate: [
      { title: "Trees — Binary Trees and BST", concept: "Trees are hierarchical structures:\n\n• Binary tree: max 2 children per node\n• BST: left < parent < right\n• Traversals: inorder, preorder, postorder, level-order\n• Height-balanced: AVL, Red-Black", realWorldExample: "File systems, HTML DOM, database indexes (B-trees), AI decision trees, Huffman compression.", codeExample: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\ndef inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)\n\ndef max_depth(root):\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))', codeLanguage: "python", commonMistakes: ["Not handling None nodes", "Confusing traversal orders", "Forgetting BST inorder = sorted"], practiceQuestions: ["Height of binary tree", "Validate BST", "Lowest common ancestor", "Level-order traversal", "Serialize/deserialize tree"], tryItPrompt: "Print 'tree traversal'", tryItExpectedOutput: "tree traversal", tryItStarterCode: 'print("tree traversal")', summary: ["BST: left < parent < right", "Inorder of BST = sorted", "DFS: inorder, preorder, postorder", "BFS: level-order with queue"] },
      { title: "Graphs — BFS, DFS, Shortest Path", concept: "Graphs model relationships:\n\n• Directed/undirected, weighted/unweighted\n• Adjacency list/matrix representations\n• BFS: shortest path (unweighted)\n• DFS: all paths, cycle detection\n• Dijkstra: weighted shortest path", realWorldExample: "Social networks, Google Maps, internet routing, recommendation systems, dependency resolution.", codeExample: 'from collections import deque\n\ndef bfs(graph, start, target):\n    queue = deque([(start, [start])])\n    visited = {start}\n    while queue:\n        node, path = queue.popleft()\n        if node == target: return path\n        for nb in graph[node]:\n            if nb not in visited:\n                visited.add(nb)\n                queue.append((nb, path + [nb]))\n    return None\n\ngraph = {0: [1, 2], 1: [3], 2: [3], 3: [4], 4: []}\nprint(bfs(graph, 0, 4))  # [0, 1, 3, 4]', codeLanguage: "python", commonMistakes: ["Not tracking visited nodes", "BFS on weighted graphs", "Not handling disconnected components"], practiceQuestions: ["BFS shortest path", "Detect cycles in directed graph", "Topological sort", "Dijkstra's algorithm", "Connected components"], tryItPrompt: "Print 'graph ready'", tryItExpectedOutput: "graph ready", tryItStarterCode: 'print("graph ready")', summary: ["BFS: level-by-level, shortest path", "DFS: depth-first, backtracking", "Adjacency list for sparse graphs", "Dijkstra for weighted paths"] },
    ],
    advanced: [
      { title: "Dynamic Programming", concept: "DP breaks problems into overlapping subproblems:\n\n• Top-down (memoization) — recursive + cache\n• Bottom-up (tabulation) — iterative + table\n• Patterns: knapsack, LCS, LIS, coin change", realWorldExample: "GPS route optimization. Cloud resource allocation. DNA sequence alignment. Portfolio optimization.", codeExample: 'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1\n\nprint(coin_change([1, 5, 10, 25], 30))  # 2', codeLanguage: "python", commonMistakes: ["Not identifying overlapping subproblems", "Wrong base case", "Not optimizing space"], practiceQuestions: ["0/1 Knapsack", "Longest common subsequence", "Climb n stairs", "Min edit distance", "Longest increasing subsequence"], tryItPrompt: "Print fib(10)", tryItExpectedOutput: "55", tryItStarterCode: "def fib(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n+1):\n        a, b = b, a+b\n    return b\nprint(fib(10))", summary: ["Identify subproblems + recurrence", "Memoization vs tabulation", "Start recursive, then optimize", "Space optimization: use previous row only"] },
    ],
  };
}

function generateCppModules(): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } {
  return {
    beginner: [
      { title: "Introduction to C++", concept: "C++ is a high-performance compiled language:\n\n• Extension of C with OOP and generics\n• Compiled to machine code (fast)\n• Manual memory management with pointers\n• STL provides data structures and algorithms", realWorldExample: "Game engines (Unreal), OS kernels, browsers (Chrome, Firefox), databases (MySQL, MongoDB).", codeExample: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    string name = "CodeClub";\n    int age = 2;\n    cout << "Welcome to " << name << endl;\n    return 0;\n}', codeLanguage: "cpp", commonMistakes: ["Forgetting #include", "Missing semicolons", "Not returning 0 from main"], practiceQuestions: ["Print name and age", "Calculate circumference of circle", "Difference between int and long long"], tryItPrompt: "Print 'Hello C++'", tryItExpectedOutput: "Hello C++", tryItStarterCode: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello C++" << endl;\n    return 0;\n}', summary: ["#include brings in headers", "cout << for output", "Every program needs int main()", "Use string from <string>"] },
      { title: "Pointers and Memory", concept: "Pointers store memory addresses:\n\n• & address-of, * dereference\n• new/delete for heap memory\n• Smart pointers: unique_ptr, shared_ptr\n• Stack vs heap allocation", realWorldExample: "Game engines manage millions of objects. DB engines use pointers for B-tree traversal. Network drivers manipulate buffers.", codeExample: '#include <iostream>\n#include <memory>\nusing namespace std;\nint main() {\n    int x = 42;\n    int* ptr = &x;\n    cout << "Value: " << *ptr << endl;\n    auto smart = make_unique<int>(100);\n    cout << "Smart: " << *smart << endl;\n    return 0;\n}', codeLanguage: "cpp", commonMistakes: ["Memory leaks from forgetting delete", "Dangling pointers", "delete vs delete[]"], practiceQuestions: ["Dynamic array with sum", "Swap using pointers", "unique_ptr for object management"], tryItPrompt: "Print 'pointers'", tryItExpectedOutput: "pointers", tryItStarterCode: '#include <iostream>\nusing namespace std;\nint main() { cout << "pointers" << endl; return 0; }', summary: ["& gets address, * dereferences", "new allocates, delete frees", "Use smart pointers in modern C++", "Stack: automatic, heap: manual"] },
      { title: "STL — Vectors, Maps, Algorithms", concept: "The STL provides:\n\n• vector, map, set, deque, queue, stack\n• sort, find, binary_search, transform\n• Iterators connect algorithms to containers", realWorldExample: "Competitive programming uses STL heavily. Game engines use vectors. Databases use maps for indexes.", codeExample: '#include <iostream>\n#include <vector>\n#include <map>\n#include <algorithm>\nusing namespace std;\nint main() {\n    vector<int> nums = {5, 3, 8, 1, 9};\n    sort(nums.begin(), nums.end());\n    for (int n : nums) cout << n << " ";\n    cout << endl;\n    map<string, int> scores;\n    scores["Alice"] = 95;\n    for (auto& [name, score] : scores)\n        cout << name << ": " << score << endl;\n    return 0;\n}', codeLanguage: "cpp", commonMistakes: ["Iterator invalidation", "[] on map creates defaults", "Not using auto for iterators"], practiceQuestions: ["Sort vector of pairs", "Frequency counter with unordered_map", "Binary search on sorted vector"], tryItPrompt: "Print 'STL ready'", tryItExpectedOutput: "STL ready", tryItStarterCode: '#include <iostream>\nusing namespace std;\nint main() { cout << "STL ready" << endl; return 0; }', summary: ["vector: dynamic array", "map: ordered, unordered_map: O(1)", "sort, find in <algorithm>", "Range-based for: for (auto& x : container)"] },
      { title: "OOP in C++", concept: "C++ OOP:\n\n• Classes with constructors, destructors\n• public, private, protected\n• Inheritance, virtual functions\n• Abstract classes, operator overloading", realWorldExample: "Game engines: GameObject→Character→Player. GUI: Widget→Button. Physics engines override collision methods.", codeExample: 'class Shape {\nprotected:\n    string name;\npublic:\n    Shape(string n) : name(n) {}\n    virtual double area() const = 0;\n    virtual ~Shape() = default;\n};\n\nclass Circle : public Shape {\n    double r;\npublic:\n    Circle(double r) : Shape("Circle"), r(r) {}\n    double area() const override { return 3.14159 * r * r; }\n};', codeLanguage: "cpp", commonMistakes: ["Forgetting virtual destructor", "Object slicing", "Not using override keyword"], practiceQuestions: ["Animal hierarchy with speak()", "Operator overloading for Vector2D", "Abstract Shape with Circle, Square"], tryItPrompt: "Print 'oop cpp'", tryItExpectedOutput: "oop cpp", tryItStarterCode: '#include <iostream>\nusing namespace std;\nint main() { cout << "oop cpp" << endl; return 0; }', summary: ["Virtual functions enable polymorphism", "= 0 makes pure virtual (abstract)", "Always virtual destructor in base", "override catches mismatches"] },
      { title: "Templates and Modern C++", concept: "Advanced C++ features:\n\n• Templates for generic programming\n• Lambda expressions\n• Move semantics, rvalue references\n• constexpr, RAII", realWorldExample: "STL is built with templates. Game engines use lambdas. Trading systems use move semantics.", codeExample: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\ntemplate<typename T>\nT findMax(const vector<T>& vec) {\n    T m = vec[0];\n    for (const auto& v : vec) if (v > m) m = v;\n    return m;\n}\n\nint main() {\n    auto square = [](int x) { return x * x; };\n    cout << square(5) << endl;\n    vector<int> nums = {3, 1, 4, 1, 5};\n    cout << "Max: " << findMax(nums) << endl;\n    return 0;\n}', codeLanguage: "cpp", commonMistakes: ["Cryptic template errors", "Forgetting to move", "Lambda capture to temporary"], practiceQuestions: ["Generic min/max template", "Simple smart pointer with RAII", "Lambdas with STL algorithms"], tryItPrompt: "Print 'modern cpp'", tryItExpectedOutput: "modern cpp", tryItStarterCode: '#include <iostream>\nusing namespace std;\nint main() { cout << "modern cpp" << endl; return 0; }', summary: ["Templates: generic programming", "Lambdas: [capture](params) { body }", "Move semantics avoid copies", "RAII ties resources to objects"] },
    ],
    intermediate: [],
    advanced: [],
  };
}

function generateWebDevModules(): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } {
  return {
    beginner: [
      { title: "HTML Fundamentals", concept: "HTML structures web content:\n\n• Elements: <tag>content</tag>\n• Semantic tags: header, nav, main, footer\n• Forms: input, select, textarea\n• HTML5: video, audio, canvas", realWorldExample: "Every website is HTML. Email templates, mobile WebViews, documentation sites.", codeExample: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My Page</title>\n</head>\n<body>\n    <header><h1>Welcome</h1></header>\n    <main>\n        <section><h2>About</h2><p>We teach coding.</p></section>\n        <form>\n            <input type="email" required>\n            <button type="submit">Subscribe</button>\n        </form>\n    </main>\n</body>\n</html>', codeLanguage: "html", commonMistakes: ["Not closing tags", "Missing alt on images", "div for everything", "No viewport meta"], practiceQuestions: ["Personal portfolio structure", "Registration form", "Student data table", "Blog post with semantic HTML"], tryItPrompt: "Print 'HTML ready'", tryItExpectedOutput: "HTML ready", tryItStarterCode: 'print("HTML ready")', summary: ["Use semantic tags", "Always alt text on images", "Forms need validation", "Viewport meta for mobile"] },
      { title: "CSS Fundamentals", concept: "CSS styles web content:\n\n• Selectors: element, .class, #id\n• Box model: content, padding, border, margin\n• Flexbox (1D) and Grid (2D)\n• Responsive: media queries, relative units", realWorldExample: "Every styled site uses CSS. Design systems (Bootstrap, Material) are CSS frameworks.", codeExample: '.card {\n    padding: 20px;\n    border-radius: 8px;\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.nav { display: flex; justify-content: space-between; gap: 16px; }\n.grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: 20px;\n}\n@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }', codeLanguage: "css", commonMistakes: ["!important overuse", "No box-sizing: border-box", "Fixed widths", "Not testing mobile"], practiceQuestions: ["Style a card component", "Responsive navbar with Flexbox", "Photo grid with CSS Grid", "Mobile-first media queries"], tryItPrompt: "Print 'CSS styled'", tryItExpectedOutput: "CSS styled", tryItStarterCode: 'print("CSS styled")', summary: ["Box model: content+padding+border+margin", "Flexbox for 1D", "Grid for 2D", "rem/em for responsive"] },
      { title: "React Fundamentals", concept: "React builds UIs with components:\n\n• Components: reusable UI blocks\n• JSX: HTML-like in JavaScript\n• useState for local state\n• useEffect for side effects\n• Props pass data parent→child", realWorldExample: "Facebook, Instagram, Netflix, Airbnb, Discord — all React. Next.js adds SSR.", codeExample: 'function Counter() {\n    const [count, setCount] = useState(0);\n    useEffect(() => {\n        document.title = `Count: ${count}`;\n    }, [count]);\n    return (\n        <div>\n            <h1>Count: {count}</h1>\n            <button onClick={() => setCount(c => c + 1)}>+</button>\n        </div>\n    );\n}', codeLanguage: "javascript", commonMistakes: ["Mutating state directly", "Missing key in lists", "Infinite useEffect loops"], practiceQuestions: ["Build todo app", "Search filter component", "Form with controlled inputs", "Reusable Modal component"], tryItPrompt: "Print 'React ready'", tryItExpectedOutput: "React ready", tryItStarterCode: 'console.log("React ready");', summary: ["Components are UI blocks", "useState for state", "useEffect for side effects", "Props down, events up"] },
      { title: "Full-Stack Development", concept: "Full-stack = frontend + backend:\n\n• Frontend: React, Vue\n• Backend: Node.js, Python\n• Database: PostgreSQL, MongoDB\n• API: REST, GraphQL\n• Auth: JWT, OAuth", realWorldExample: "Every production app is full-stack. E-commerce, social media, SaaS platforms.", codeExample: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\nlet todos = [];\napp.get("/api/todos", (req, res) => res.json(todos));\napp.post("/api/todos", (req, res) => {\n    const todo = { id: Date.now(), text: req.body.text, done: false };\n    todos.push(todo);\n    res.status(201).json(todo);\n});\napp.listen(3000);', codeLanguage: "javascript", commonMistakes: ["Not validating inputs", "Plain text passwords", "No error handling", "Exposing sensitive data"], practiceQuestions: ["REST API with CRUD", "JWT authentication", "Connect frontend to API", "Deploy full-stack app"], tryItPrompt: "Print 'full stack'", tryItExpectedOutput: "full stack", tryItStarterCode: 'console.log("full stack");', summary: ["REST: resources + HTTP methods", "JWT for stateless auth", "Always validate inputs", "Env vars for secrets"] },
    ],
    intermediate: [],
    advanced: [],
  };
}

export function getCourseModules(courseTitle: string): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } | null {
  const lower = courseTitle.toLowerCase();
  
  // Check static map first
  for (const [key, modules] of Object.entries(courseModulesMap)) {
    if (lower.includes(key)) return modules;
  }
  
  // Dynamic generators for major courses
  if (lower.includes("javascript") || lower.includes("js ") || lower.includes("js:")) return generateJavaScriptModules();
  if (lower.includes("java") && !lower.includes("javascript")) return generateJavaModules();
  if (lower.includes("c++") || lower.includes("cpp")) return generateCppModules();
  if (lower.includes("dsa") || lower.includes("data structure") || lower.includes("algorithm")) return generateDSAModules();
  if (lower.includes("web") || lower.includes("html") || lower.includes("css") || lower.includes("react") || lower.includes("full stack") || lower.includes("frontend")) return generateWebDevModules();
  
  // Generic modules for others
  return generateGenericModules(courseTitle);
}
