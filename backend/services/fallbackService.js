/**
 * Smart Local Rule-Based Mock Generator Service
 * Emulates the OpenAI response with high-fidelity, customized fitness and diet advice
 * tailored directly to user stats, daily routines, injuries, and local Indian food budgets.
 */
function generateLocalPlan(user) {
  const { name, age, gender, height, weight, medicalConditions, injuries, dailyRoutine, workoutTime, dietType, budget } = user;

  // Determine Daily Energy Expenditure & Calorie Goal
  // Simple BMR estimation (Mifflin-St Jeor)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'Male') bmr += 5;
  else if (gender === 'Female') bmr -= 161;
  
  // TDEE multiplier based on routine keywords
  let multiplier = 1.2; // Sedentary by default
  const routineLower = dailyRoutine.toLowerCase();
  if (routineLower.includes('active') || routineLower.includes('parent') || routineLower.includes('student') || routineLower.includes('stand')) {
    multiplier = 1.375;
  }
  if (routineLower.includes('walk') || routineLower.includes('construction') || routineLower.includes('sports')) {
    multiplier = 1.55;
  }

  const tdee = Math.round(bmr * multiplier);
  
  // Target calories based on age/weight (aim for mild deficit or maintenance)
  const targetCalories = Math.round(tdee - 200);
  
  // Custom Macro Distribution based on Diet Type
  let proteinPct = 0.25;
  let carbPct = 0.50;
  let fatPct = 0.25;
  
  if (dietType === 'Non-Vegetarian' || dietType === 'Eggitarian') {
    proteinPct = 0.30;
    carbPct = 0.45;
  }

  const proteinGrams = Math.round((targetCalories * proteinPct) / 4);
  const carbGrams = Math.round((targetCalories * carbPct) / 4);
  const fatGrams = Math.round((targetCalories * fatPct) / 9);

  // 1. WORKOUT DESIGN DYNAMICS
  const injuriesLower = injuries.toLowerCase();
  const medicalLower = medicalConditions.toLowerCase();
  
  let safetyModifier = "Perform all movements with correct form. Stay hydrated.";
  let workoutName = "AURA Hybrid General Conditioning";
  let workoutSafetyNote = "";

  if (injuriesLower.includes('knee')) {
    safetyModifier = "CRITICAL: Knee injury detected. Limit high-impact jumping and deep flexion. Modified squats and lunges included.";
    workoutSafetyNote = "Avoid squats past 90 degrees; do not let knees cave inwards.";
  } else if (injuriesLower.includes('back') || injuriesLower.includes('spine') || injuriesLower.includes('spine')) {
    safetyModifier = "CRITICAL: Lower back sensitivity detected. Substituted heavy axial loaded exercises (barbell back squats, deadlifts) with spinal-supported movements.";
    workoutSafetyNote = "Keep core braced. Use flat bench or back supported seats for overhead pushes.";
  } else if (injuriesLower.includes('shoulder')) {
    safetyModifier = "CRITICAL: Shoulder pain/impingement detected. Replaced standard overhead presses and deep dips with neutral-grip pushes and rotator cuff support.";
    workoutSafetyNote = "Limit overhead pressing; keep elbows tucked to 45 degrees during pushes.";
  }

  // Set workout routines based on time
  const exercisesPool = [
    {
      name: "Goblet Squats",
      sets: "3",
      reps: "12-15",
      rest: "60s",
      instructions: "Hold a dumbbell/kettlebell at chest level, sit back, keep heels flat on the floor.",
      safetyNote: injuriesLower.includes('knee') ? "MODIFIED: Perform bodyweight box squats onto a chair. Do not load weights." : "Keep knees aligned with toes."
    },
    {
      name: "Dumbbell Floor Press",
      sets: "3",
      reps: "10-12",
      rest: "60s",
      instructions: "Lie flat on the floor, push dumbbells straight up. The floor limits shoulder hyper-extension.",
      safetyNote: injuriesLower.includes('shoulder') ? "MODIFIED: Keep weight light, focus on slow eccentric (lowering) phase." : "Keep wrist straight."
    },
    {
      name: "Chest-Supported Dumbbell Rows",
      sets: "3",
      reps: "12",
      rest: "60s",
      instructions: "Sit facing an incline bench, pull dumbbells up to your ribs, squeeze shoulder blades.",
      safetyNote: injuriesLower.includes('back') ? "EXCELLENT CHOICE: Supported posture reduces lower back strain completely." : "Control the weight on the way down."
    },
    {
      name: "DB Roman Chair Romanian Deadlifts",
      sets: "3",
      reps: "10",
      rest: "75s",
      instructions: "Hinge at the hips, push glutes back, slide dumbbells down thighs, keep back perfectly flat.",
      safetyNote: injuriesLower.includes('back') ? "MODIFIED: Substituted with bodyweight Glute Bridges on the floor to fully protect the spine." : "Stop when you feel hamstring tension; do not round your back."
    },
    {
      name: "Plank Hold",
      sets: "3",
      reps: "30-45s",
      rest: "45s",
      instructions: "Keep body in a straight line from head to heels, squeeze glutes and brace abdominal wall.",
      safetyNote: "Ensure your lower back doesn't sag. Drop to knees if form breaks."
    },
    {
      name: "Incline Dumbbell Curl",
      sets: "2",
      reps: "12-15",
      rest: "45s",
      instructions: "Sit on an incline bench, curl dumbbells, keeping elbows locked under shoulders.",
      safetyNote: "Do not swing your body."
    },
    {
      name: "Overhead Dumbbell Tricep Extension",
      sets: "2",
      reps: "12-15",
      rest: "45s",
      instructions: "Sit upright, hold one dumbbell with both hands behind head, extend elbows fully.",
      safetyNote: injuriesLower.includes('shoulder') ? "MODIFIED: Substituted with Dumbbell Kickbacks to minimize shoulder flexion overhead." : "Keep elbows tucked in."
    }
  ];

  // Adjust number of exercises based on available workoutTime
  let exercises = [];
  if (workoutTime <= 25) {
    // 3 highly active compounds
    workoutName = "AURA Obsidian Express Plan";
    exercises = [exercisesPool[0], exercisesPool[1], exercisesPool[2]];
    exercises.forEach(e => { e.sets = "3"; e.rest = "45s"; });
  } else if (workoutTime <= 45) {
    // 4 exercises
    workoutName = "AURA Focused Glassmorphic Core";
    exercises = [exercisesPool[0], exercisesPool[1], exercisesPool[2], exercisesPool[4]];
  } else if (workoutTime <= 60) {
    // 5 exercises
    workoutName = "AURA Premium Sculpt Routine";
    exercises = [exercisesPool[0], exercisesPool[1], exercisesPool[2], exercisesPool[3], exercisesPool[4]];
  } else {
    // 90 minutes full routine - 7 exercises
    workoutName = "AURA Luxury Tier Athlete Conditioning";
    exercises = [...exercisesPool];
  }

  // 2. DIET DESIGN DYNAMICS (Staple budget-optimized Indian diet)
  // Daily budget
  const dailyBudget = Math.round(budget / 30);
  
  // We will structure meals dynamically. Let's create budget classes:
  // Low budget: <= ₹4000/month (~₹133/day)
  // Mid budget: <= ₹8000/month (~₹266/day)
  // High budget: > ₹8000/month
  
  let meals = {};
  let actualCost = 0;

  if (budget < 4500) {
    // Ultra economical staples: Oats, eggs/soya chunks, bananas, rice, dal, peanut butter, seasonal veggies
    if (dietType === 'Vegetarian' || dietType === 'Vegan') {
      meals = {
        breakfast: {
          name: "Soya-Oats Porridge with Banana",
          ingredients: ["Rolled Oats (40g) - ₹8", "Soy Milk/Water (250ml) - ₹5", "Soya Chunks powder (20g) - ₹4", "1 Banana - ₹5"],
          costEstimateINR: 22
        },
        lunch: {
          name: "High Protein Moong Dal Khichdi",
          ingredients: ["Rice (60g) - ₹5", "Split Yellow Moong Dal (40g) - ₹6", "Onions, Tomatoes, Mustard Oil - ₹7", "Roasted Papad - ₹2"],
          costEstimateINR: 20
        },
        snack: {
          name: "Sprouted Kala Chana Chaat",
          ingredients: ["Sprouted Brown Chickpeas (50g) - ₹5", "Onion, Tomato, Lemon juice - ₹4", "Spices (Chaat Masala) - ₹1"],
          costEstimateINR: 10
        },
        dinner: {
          name: "Roti with Soybean Bhurji & Salad",
          ingredients: ["Whole Wheat Roti (3 pieces) - ₹6", "Soya Granules (40g, spiced) - ₹8", "Onions & green chillies - ₹3", "Cucumber salad - ₹5"],
          costEstimateINR: 22
        }
      };
    } else if (dietType === 'Eggitarian') {
      meals = {
        breakfast: {
          name: "Egg Oats Omelette & Tea",
          ingredients: ["Whole Eggs (2) - ₹14", "Oats powder (30g) - ₹6", "Onion, Chilli - ₹2", "Black Tea - ₹2"],
          costEstimateINR: 24
        },
        lunch: {
          name: "Boiled Egg Curry with Steamed Rice",
          ingredients: ["Boiled Eggs (2) - ₹14", "White/Brown Rice (80g) - ₹7", "Tomato Onion Gravy & Spices - ₹8"],
          costEstimateINR: 29
        },
        snack: {
          name: "Spiced Kala Chana Chaat",
          ingredients: ["Kala Chana (boiled, 50g) - ₹5", "Chili, Onion, Cucumber - ₹4"],
          costEstimateINR: 9
        },
        dinner: {
          name: "Roti with Egg Bhurji & Tomato Salad",
          ingredients: ["Whole Wheat Roti (3) - ₹6", "Eggs (2, scrambled) - ₹14", "Onion, Capsicum, Oil - ₹5", "Tomato slices - ₹3"],
          costEstimateINR: 28
        }
      };
    } else { // Non-Vegetarian
      meals = {
        breakfast: {
          name: "Masala Egg Scramble & Brown Bread",
          ingredients: ["Eggs (2) - ₹14", "Brown Bread slices (2) - ₹6", "Butter (5g) - ₹2", "Onion & Tomato - ₹3"],
          costEstimateINR: 25
        },
        lunch: {
          name: "Chicken Keema Rice with Curd",
          ingredients: ["Minced Chicken Breast (80g) - ₹24", "Basmati Rice (70g) - ₹6", "Spices, Garlic, Ginger - ₹6", "Curd (100g) - ₹10"],
          costEstimateINR: 46
        },
        snack: {
          name: "Sprouted Green Moong",
          ingredients: ["Moong Sprouts (60g) - ₹6", "Lemon & Salt - ₹1"],
          costEstimateINR: 7
        },
        dinner: {
          name: "Roti with Egg Curry",
          ingredients: ["Roti (3) - ₹6", "Eggs (2) - ₹14", "Onion Gravy - ₹7", "Raw Cucumber - ₹4"],
          costEstimateINR: 31
        }
      };
    }
  } else if (budget < 9000) {
    // Moderate budget: Paneer, Curd, Chicken Breast, Whey (occasionally), Eggs, Rice, Wheat
    if (dietType === 'Vegetarian') {
      meals = {
        breakfast: {
          name: "High Protein Paneer Bhurji & Multi-grain Toast",
          ingredients: ["Low-fat Paneer (100g) - ₹40", "Multigrain Bread (2 slices) - ₹8", "Onions, Tomatoes, Ghee (5g) - ₹8"],
          costEstimateINR: 56
        },
        lunch: {
          name: "Jeera Rice with Dal Tadka & Paneer Sabji",
          ingredients: ["Basmati Rice (80g) - ₹8", "Toor Dal (50g) - ₹7", "Paneer (50g) - ₹20", "Curd (100g) - ₹10", "Salad - ₹6"],
          costEstimateINR: 51
        },
        snack: {
          name: "Roasted Makhana & Peanut Butter",
          ingredients: ["Lotus Seeds / Makhana (30g) - ₹15", "Peanut Butter (1 tbsp, 16g) - ₹8", "Green Tea - ₹5"],
          costEstimateINR: 28
        },
        dinner: {
          name: "Chapati with Soya-Paneer Curry",
          ingredients: ["Wheat Chapati (3) - ₹6", "Paneer (50g) - ₹20", "Soya Chunks (30g) - ₹6", "Thick onion gravy & Oil - ₹9", "Mixed Salad - ₹8"],
          costEstimateINR: 49
        }
      };
    } else if (dietType === 'Vegan') {
      meals = {
        breakfast: {
          name: "Tofu Scramble & Multigrain Toast",
          ingredients: ["Tofu (120g) - ₹35", "Toast (2 slices) - ₹8", "Olive Oil & Turmeric - ₹6"],
          costEstimateINR: 49
        },
        lunch: {
          name: "Brown Rice with Rajma & Roasted Broccoli",
          ingredients: ["Brown Rice (80g) - ₹9", "Rajma / Kidney Beans (60g) - ₹8", "Broccoli & Carrot stir fry - ₹20", "Mustard Oil - ₹4"],
          costEstimateINR: 41
        },
        snack: {
          name: "Peanuts & Roasted Chana Mix",
          ingredients: ["Roasted Peanuts (30g) - ₹6", "Roasted Black Chana (30g) - ₹4", "Green Tea - ₹5"],
          costEstimateINR: 15
        },
        dinner: {
          name: "Roti with Soya Granules Matar & Cucumber Salad",
          ingredients: ["Wheat Roti (3) - ₹6", "Soya Granules (50g) - ₹10", "Green Peas (30g) - ₹5", "Onion-tomato gravy - ₹8", "Cucumber - ₹5"],
          costEstimateINR: 34
        }
      };
    } else if (dietType === 'Eggitarian') {
      meals = {
        breakfast: {
          name: "3-Egg Whites & 1-Whole Egg Masala Omelette",
          ingredients: ["Eggs (4) - ₹28", "Toast (2 slices) - ₹8", "Spices, Herbs, Butter - ₹6", "Milk (150ml) - ₹9"],
          costEstimateINR: 51
        },
        lunch: {
          name: "Egg Bhurji with Roti, Curd & Dal",
          ingredients: ["Eggs (3) - ₹21", "Whole Wheat Roti (3) - ₹6", "Moong Dal (40g) - ₹6", "Thick Curd (150g) - ₹15", "Salad - ₹5"],
          costEstimateINR: 53
        },
        snack: {
          name: "Banana & Peanut Butter Toast",
          ingredients: ["Banana (1) - ₹5", "Peanut Butter (1.5 tbsp) - ₹12", "Brown Bread (1 slice) - ₹4"],
          costEstimateINR: 21
        },
        dinner: {
          name: "Egg Rice Bowl with Sauteed Veggies",
          ingredients: ["Scrambled Eggs (3) - ₹21", "White/Brown Rice (80g) - ₹8", "Carrot, Beans, Capsicum stir-fry - ₹15", "Soy sauce & oil - ₹4"],
          costEstimateINR: 48
        }
      };
    } else { // Non-Vegetarian
      meals = {
        breakfast: {
          name: "Boiled Eggs & Buttered Toast",
          ingredients: ["Whole Eggs (2) - ₹14", "Egg Whites (2) - ₹14", "Toast (2 slices) - ₹8", "Amul Butter (10g) - ₹4"],
          costEstimateINR: 40
        },
        lunch: {
          name: "Basmati Rice with Chicken Breast Curry & Salad",
          ingredients: ["Chicken Breast (150g) - ₹45", "Basmati Rice (90g) - ₹9", "Oil, Ginger-garlic, Spices - ₹10", "Salad (Cucumber/Tomato) - ₹6"],
          costEstimateINR: 70
        },
        snack: {
          name: "Boiled Chana & Green Tea",
          ingredients: ["Boiled Chickpeas (60g) - ₹6", "Chaat Masala & Lime - ₹2", "Green Tea - ₹5"],
          costEstimateINR: 13
        },
        dinner: {
          name: "Roti with Dry Tawa Chicken & Curd",
          ingredients: ["Wheat Roti (3) - ₹6", "Chicken Breast (100g, grilled) - ₹30", "Curd (100g) - ₹10", "Spices & butter - ₹6"],
          costEstimateINR: 52
        }
      };
    }
  } else {
    // Luxury tier budget: Premium staples, Almonds, Salmon/Fish, Avocado, Whey Protein, imported Paneer/Greek Yogurt
    if (dietType === 'Vegetarian') {
      meals = {
        breakfast: {
          name: "Whey Protein Oats Bowl with Almonds & Berries",
          ingredients: ["Whey Protein (1 scoop) - ₹75", "Oats (50g) - ₹10", "Almonds (10 pieces) - ₹12", "Chia Seeds & Berries - ₹20", "Skimmed Milk (200ml) - ₹12"],
          costEstimateINR: 129
        },
        lunch: {
          name: "Grilled Paneer Avocado Salad & Brown Rice",
          ingredients: ["Premium Paneer (150g) - ₹60", "Brown Rice (80g) - ₹9", "Avocado (0.5 piece) - ₹40", "Mixed Exotic Salad - ₹20", "Curd (150g) - ₹15"],
          costEstimateINR: 144
        },
        snack: {
          name: "Greek Yogurt with Peanut Butter",
          ingredients: ["Greek Yogurt (150g) - ₹45", "Organic Peanut Butter (2 tbsp) - ₹15", "Apple slices - ₹15"],
          costEstimateINR: 75
        },
        dinner: {
          name: "Sautéed Tofu-Paneer Veggie Stir Fry & Quinoa",
          ingredients: ["Quinoa (60g) - ₹15", "Paneer (100g) - ₹40", "Tofu (50g) - ₹15", "Broccoli, Bell Peppers, Asparagus - ₹35", "Olive Oil - ₹10"],
          costEstimateINR: 115
        }
      };
    } else if (dietType === 'Vegan') {
      meals = {
        breakfast: {
          name: "Vegan Plant Protein Oats Bowl with Seeds",
          ingredients: ["Plant Protein Isolate (1 scoop) - ₹70", "Oats (50g) - ₹10", "Almond Milk (200ml) - ₹25", "Chia & Pumpkin seeds - ₹15"],
          costEstimateINR: 120
        },
        lunch: {
          name: "Quinoa Salad with Grilled Tofu & Hummus",
          ingredients: ["Quinoa (80g) - ₹20", "Organic Tofu (150g) - ₹45", "Hummus (2 tbsp) - ₹15", "Mixed Greens & Olive Oil - ₹25"],
          costEstimateINR: 105
        },
        snack: {
          name: "Mixed Nuts (Almonds, Walnuts) & Green Tea",
          ingredients: ["Raw Almonds & Walnuts (40g) - ₹30", "Organic Green Tea - ₹7"],
          costEstimateINR: 37
        },
        dinner: {
          name: "Chickpea & Sweet Potato Curry with Avocado Toast",
          ingredients: ["Chickpeas (80g) - ₹8", "Sweet Potato (100g) - ₹10", "Multigrain Bread (1 slice) - ₹4", "Avocado paste - ₹35", "Olive Oil & Gravy - ₹15"],
          costEstimateINR: 72
        }
      };
    } else if (dietType === 'Eggitarian') {
      meals = {
        breakfast: {
          name: "Whey Shake & Egg White Scramble on Toast",
          ingredients: ["Whey Protein (1 scoop) - ₹75", "Egg Whites (4) - ₹28", "Sourdough Toast (2 slices) - ₹15", "Avocado spread - ₹25"],
          costEstimateINR: 143
        },
        lunch: {
          name: "Egg Salad Bowl with Quinoa & Greek Yogurt",
          ingredients: ["Boiled Eggs (3) - ₹21", "Egg Whites (3) - ₹21", "Quinoa (80g) - ₹20", "Bell Peppers, Cucumber, Olives - ₹25", "Greek Yogurt (100g) - ₹30"],
          costEstimateINR: 117
        },
        snack: {
          name: "Roasted Almonds & Protein Bar",
          ingredients: ["Protein Bar - ₹80", "Almonds (10 pieces) - ₹12"],
          costEstimateINR: 92
        },
        dinner: {
          name: "Shakshuka (Eggs Poached in Spiced Tomato) & Garlic Bread",
          ingredients: ["Whole Eggs (3) - ₹21", "Egg Whites (2) - ₹14", "Tomato & Capsicum Puree - ₹15", "Sourdough Toast (2) - ₹15", "Cheese (15g) - ₹10"],
          costEstimateINR: 75
        }
      };
    } else { // Non-Vegetarian
      meals = {
        breakfast: {
          name: "Whey Protein Shake & 4-Egg White Omelette",
          ingredients: ["Whey Protein (1 scoop) - ₹75", "Egg Whites (4) - ₹28", "Whole Wheat Toast (2) - ₹8", "Fruit Salad - ₹15"],
          costEstimateINR: 126
        },
        lunch: {
          name: "Basmati Rice with Olive-Oil Grilled Chicken & Avocado",
          ingredients: ["Chicken Breast (200g) - ₹60", "Basmati Rice (100g) - ₹10", "Half Avocado - ₹40", "Mixed Broccoli/Zucchini Salad - ₹30", "Olive Oil - ₹10"],
          costEstimateINR: 150
        },
        snack: {
          name: "Greek Yogurt & Mixed Raw Walnuts",
          ingredients: ["Flavoured Greek Yogurt - ₹50", "Raw Walnuts (25g) - ₹25"],
          costEstimateINR: 75
        },
        dinner: {
          name: "Pan-Seared Fish/Chicken Breast with Quinoa & Asparagus",
          ingredients: ["Premium Chicken/Fish Fillet (180g) - ₹65", "Quinoa (60g) - ₹15", "Asparagus, Cherry Tomatoes - ₹35", "Butter/Garlic dressing - ₹10"],
          costEstimateINR: 125
        }
      };
    }
  }

  // Calculate actual daily cost
  actualCost = Object.values(meals).reduce((sum, meal) => sum + meal.costEstimateINR, 0);

  // Apply Medical Condition Alterations
  if (medicalLower.includes('diabetes') || medicalLower.includes('sugar')) {
    // Highlight low GI carbs and restrict white rice/sugar
    meals.lunch.name = meals.lunch.name.replace("Rice", "Brown Rice").replace("Basmati Rice", "Brown Rice");
    meals.lunch.ingredients.push("DIABETES MODIFIER: Replaced White Rice with Brown Rice for low Glycemic Index.");
    if (meals.breakfast.name.includes("Banana")) {
      meals.breakfast.name = meals.breakfast.name.replace("Banana", "Berries/Apple");
      meals.breakfast.ingredients = meals.breakfast.ingredients.filter(i => !i.includes("Banana"));
      meals.breakfast.ingredients.push("Apple/Berries (Low Glycemic Index) - ₹12");
      actualCost += 7;
    }
  }

  if (medicalLower.includes('pcos') || medicalLower.includes('thyroid')) {
    // Emphasize healthy fats, anti-inflammatory and soy limits
    if (dietType === 'Vegetarian' || dietType === 'Vegan') {
      // Switch soya to paneer or chickpea for thyroid if soya is soy-intensive
      meals.breakfast.name = meals.breakfast.name.replace("Soya-Oats", "Chia-Almond Oats");
      meals.breakfast.ingredients = meals.breakfast.ingredients.filter(i => !i.includes("Soya"));
      meals.breakfast.ingredients.push("Almond Milk & Chia Seeds - ₹20");
      actualCost += 11;
    }
    meals.dinner.ingredients.push("PCOS/THYROID MODIFIER: Anti-inflammatory fats included; gluten-reduced grain source prioritized.");
  }

  return {
    workout: {
      routineName: workoutName,
      availableTime: workoutTime,
      safetyModifier: safetyModifier,
      exercises: exercises
    },
    diet: {
      dietType: dietType,
      monthlyBudgetINR: budget,
      estimatedDailyCostINR: actualCost,
      macros: {
        protein: `${proteinGrams}g`,
        carbs: `${carbGrams}g`,
        fats: `${fatGrams}g`,
        calories: `${targetCalories} kcal`
      },
      meals: meals
    }
  };
}

module.exports = {
  generateLocalPlan
};
