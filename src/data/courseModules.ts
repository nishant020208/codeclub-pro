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

export function getCourseModules(courseTitle: string): { beginner: ModuleData[]; intermediate: ModuleData[]; advanced: ModuleData[] } | null {
  const lower = courseTitle.toLowerCase();
  for (const [key, modules] of Object.entries(courseModulesMap)) {
    if (lower.includes(key)) return modules;
  }
  // Return generic modules for courses without custom content
  return generateGenericModules(courseTitle);
}
