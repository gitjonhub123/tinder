export const QUESTIONS = [
  {
    number: 1,
    title: 'Scaling Laws & Emergence Prediction',
    text: `Recent research (Chinchilla, Grok) suggests that large language models follow predictable scaling laws. However, emergence—sudden jumps in model capability at certain scales—remains poorly understood and often unpredicted.

Design a framework to:

1. Predict at what scale and training compute an LLM will exhibit a specific emergent capability (e.g., chain-of-thought reasoning, few-shot learning, code generation).

2. Explain the mechanistic basis for why emergence occurs (what changes in the model's internal representations and loss landscape).

3. Propose an experiment to validate your framework using publicly available compute budgets.

4. Discuss how your approach could reduce the compute wasted on "scaling blindly" versus predicting emergence more precisely.

Assume you have access to training runs at 1B, 7B, 13B, 70B, and 175B parameters. Your answer should include concrete mathematical or algorithmic reasoning, not just intuition.`,
  },
  {
    number: 2,
    title: 'Adversarial Robustness & Certified Defenses at Scale',
    text: `Current adversarial robustness techniques (adversarial training, certified defenses via randomized smoothing) either degrade model performance significantly or are computationally prohibitive for large-scale models. The field has not solved robust-accurate tradeoffs convincingly.

Propose a novel approach to:

1. Build certified robustness guarantees for vision transformers or LLMs at scale without >5% accuracy drop.

2. Design a training procedure that achieves robustness to L∞, L2, and semantic perturbations simultaneously.

3. Explain why existing methods fail and how your approach overcomes fundamental barriers (e.g., loss landscape geometry, data efficiency).

4. Provide pseudocode or mathematical formulation for the core algorithm.

5. Discuss computational complexity and feasibility on standard hardware.

Your answer should acknowledge the current state-of-the-art (e.g., TRADES, randomized smoothing, adversarial training variants) and clearly articulate where your approach innovates.`,
  },
  {
    number: 3,
    title: 'Mechanistic Interpretability & Model Surgery',
    text: `Mechanistic interpretability aims to reverse-engineer neural networks at a granular level (circuits, attention heads, neurons). Current work is largely post-hoc analysis; proactive model editing and surgical interventions remain nascent.

Design a system to:

1. Identify and isolate specific "circuits" in a transformer (e.g., the subset of parameters responsible for bias, hallucination, or factual knowledge).

2. Propose a method to surgically modify or remove these circuits without retraining the full model.

3. Validate that your surgery removes the target behavior (e.g., reduces hallucination) without catastrophic failure in other capabilities.

4. Extend your approach to a multi-task setting where you must preserve some circuits while modifying others (e.g., keep knowledge but remove bias).

5. Discuss scalability: how does your method work for models with billions of parameters?

Your answer should ground itself in recent mechanistic interpretability work (e.g., attention head analysis, feature visualization, causal interventions) and propose concrete mechanisms for surgery.`,
  },
  {
    number: 4,
    title: 'Training Efficiency & Sample Complexity in Non-Stationary Environments',
    text: `Foundation models are typically trained on static data distributions, yet real-world deployment occurs in non-stationary, continually evolving environments (e.g., evolving internet text, domain shifts, adversarial distribution changes). Online learning and continual learning approaches exist but remain fragmented.

Propose a unified framework for:

1. Efficiently training or adapting a large foundation model in a continually non-stationary environment with minimal sample complexity and compute overhead.

2. Design a mechanism to detect when distribution shift is occurring and trigger adaptive retraining.

3. Propose a parameter-efficient method (e.g., adapter, LoRA variant, or novel technique) to update the model online without catastrophic forgetting.

4. Formalize the sample complexity and compute cost tradeoff: under what conditions is online adaptation cheaper than periodic retraining?

5. Discuss how your approach scales to trillion-parameter models.

Your answer should address the key challenges: data efficiency, computational cost, avoiding catastrophic forgetting, and theoretical guarantees (if possible).`,
  ],
]
