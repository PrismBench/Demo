import BenchmarkComparison from "../components/common/HeroCard/BenchmarkComparison";
import StaticBenchmarkSaturation from "../components/graphics/StaticBenchmarkSaturation";
import LLMCapabilityEvolution from "../components/graphics/LLMCapabilityEvolution";
import NaiveDynamicBenchmark from "../components/graphics/NaiveDynamicBenchmark";
import EvaluationAdaption from "../components/graphics/EvaluationAdaption";
import MultiAgentEval from "../components/graphics/MultiAgentEval";
export const HeroCardContent = {
  title: "Rethinking LLM Evaluation: Why Static Benchmarks Fall Short",
  description:
    "Static benchmarks lose diagnostic value as models improve: they saturate early, fail to capture new failure modes, and reward superficial heuristics. As model behaviors evolve, evaluation must adapt. We propose a dynamic framework that builds branching task trajectories based on model performance, using multi-agent coordination and reinforcement learning to uncover weaknesses and refine evaluation pressure.",
  expandButtonText: "Why LLM Evaluation Must Adapt",
  collapseButtonText: "Collapse",
  heroDiagram: BenchmarkComparison,
  sections: [
    {
      title: "Static Benchmarks Saturate Quickly",
      description:
        "Most evaluation suites consist of a fixed set of tasks drawn from a precompiled dataset [1]. Once a model performs well on these, the benchmark ceases to reveal meaningful differences. Over time, models become overfitted to the test set distribution [2] , [3], and further improvements in capability are not captured which masks important weaknesses behind perfect or near-perfect scores [4].",
      diagram: StaticBenchmarkSaturation,
      citations: [
        {
          content:
            "McIntosh, Timothy R., et al. 'Inadequacies of large language model benchmarks in the era of generative artificial intelligence.' IEEE Transactions on Artificial Intelligence (2025).",
        },
        {
          content:
            "Xu, Cheng, et al. 'Benchmark data contamination of large language models: A survey.' arXiv preprint arXiv:2406.04244 (2024).",
        },
        {
          content:
            "Zhou, Kun, et al. 'Don't make your LLM an evaluation benchmark cheater.' arXiv preprint arXiv:2311.01964 (2023).",
        },
        {
          content:
            "Banerjee, Sourav, Ayushi Agarwal, and Eishkaran Singh. 'The Vulnerability of Language Model Benchmarks: Do They Accurately Reflect True LLM Performance?' arXiv preprint arXiv:2412.03597 (2024).",
        },
      ],
    },
    {
      title: "LLM Capabilities Are Evolving Rapidly",
      description:
        "Recent advances in model scale, architecture, and optimization have led to sharp, sometimes nonlinear improvements in performance across tasks [5]. These gains are often nonlinear and driven by discrete changes such as increased parameter counts, improved training objectives, or techniques like reasoning [6]. But benchmark difficulty has remained largely static, making it hard to tell whether models are actually improving or just exploiting flaws in the test set. In some cases, these gains come from data leakage [7], where evaluation data leaks into training, or from memorization [8], where models perform well on new tasks simply because they resemble ones seen before.",
      diagram: LLMCapabilityEvolution,
      citations: [
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content:
            "Xu, Ruijie, et al. 'Benchmarking benchmark leakage in large language models.' arXiv preprint arXiv:2404.18824 (2024).",
        },
        {
          content:
            "Wang, Kun, et al. 'A Comprehensive Survey in LLM (-Agent) Full Stack Safety: Data, Training and Deployment.' arXiv preprint arXiv:2504.15585 (2025).",
        },
        {
          content:
            "Roberts, Manley, et al. 'Data contamination through the lens of time.' arXiv preprint arXiv:2310.10628 (2023).",
        },
        {
          content:
            "Dong, Yihong, et al. 'Generalization or memorization: Data contamination and trustworthy evaluation for large language models.' arXiv preprint arXiv:2402.15938 (2024).",
        },
      ],
    },
    {
      title: "Evaluation Frameworks Must Adapt",
      description:
        "LLMs often learn to exploit artifacts in training or test data [5], [6], [7], [8]. Which results in shortcuts that yield high scores without true generalization. Static evaluation frameworks cannot keep pace with these evolving behaviors. To remain meaningful, evaluation must become conditional: adapting to the model's responses and searching for the precise boundary between success and failure and the root cause of failure.",
      diagram: EvaluationAdaption,
      citations: [
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content:
            "Xu, Ruijie, et al. 'Benchmarking benchmark leakage in large language models.' arXiv preprint arXiv:2404.18824 (2024).",
        },
        {
          content:
            "Wang, Kun, et al. 'A Comprehensive Survey in LLM (-Agent) Full Stack Safety: Data, Training and Deployment.' arXiv preprint arXiv:2504.15585 (2025).",
        },
        {
          content:
            "Roberts, Manley, et al. 'Data contamination through the lens of time.' arXiv preprint arXiv:2310.10628 (2023).",
        },
        {
          content:
            "Dong, Yihong, et al. 'Generalization or memorization: Data contamination and trustworthy evaluation for large language models.' arXiv preprint arXiv:2402.15938 (2024).",
        },
      ],
    },
    {
      title: "Why Naive Dynamic Benchmarks Still Fall Short",
      description:
        "Some recent benchmarks attempt dynamism by adding new tasks or adversarial examples [9], [10], [11]. However, these are often generated by other LLMs or pulled from static banks of prompts. When generation and evaluation are both handled by models with shared blind spots, the result is an echo chamber: familiar failures go unnoticed, and benchmarks overestimate robustness. [12], [13]",
      diagram: NaiveDynamicBenchmark,
      citations: [
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content: "",
        },
        {
          content:
            "Zhu, Kaijie, et al. 'Dynamic evaluation of large language models by meta probing agents.' arXiv preprint arXiv:2402.14865 (2024).",
        },
        {
          content:
            "Fan, Lizhou, et al. 'Nphardeval: Dynamic benchmark on reasoning ability of large language models via complexity classes.' arXiv preprint arXiv:2312.14890 (2023).",
        },
        {
          content:
            "Zhuge, Mingchen, et al. 'Agent-as-a-judge: Evaluate agents with agents.' arXiv preprint arXiv:2410.10934 (2024).",
        },
        {
          content:
            "Thakur, Aman Singh, et al. 'Judging the judges: Evaluating alignment and vulnerabilities in llms-as-judges.' arXiv preprint arXiv:2406.12624 (2024).",
        },
        {
          content:
            "Blackwell, Robert E., Jon Barry, and Anthony G. Cohn. 'Towards Reproducible LLM Evaluation: Quantifying Uncertainty in LLM Benchmark Scores.' arXiv preprint arXiv:2410.03492 (2024).",
        },
      ],
    },
    {
      title: "Multi-Agent, Model-Agnostic Evaluation",
      description:
        "An effective dynamic benchmark must operate as a system: generating tasks, analyzing failures, and adjusting difficulty based on observed behavior. This requires coordinated search, often with multiple agents proposing tasks, identifying error types, or probing specific capabilities. Crucially, scoring must not rely on LLMs themselves. Instead, reward signals should come from deterministic, model-agnostic criteria such as unit test pass rates, symbolic correctness, or trusted human annotation.",
      diagram: "",
    },
    {
      title:
        "PrismBench: A Framework for Dynamic, Verifiable Evaluation of LLMs on Code",
      description:
        "PrismBench evaluates LLMs through a branching task tree that evolves based on model behavior. Each branch isolates a different failure mode or reasoning path. Multiple agents explore the space of possible probes, and scoring is grounded in external oracles and never in the models themselves. As a result, PrismBench produces evaluations that stay diagnostic over time, surface failure clusters, and resist optimization through shortcut learning.",
      diagram: "",
    },
  ],
};
