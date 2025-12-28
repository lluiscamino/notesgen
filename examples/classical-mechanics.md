# 1. Principles of Classical Mechanics: A Lagrangian Approach

This document explores the transition from Newtonian mechanics to the more sophisticated Lagrangian formulation. We will cover the Principle of Least Action, the Euler-Lagrange equations, and their applications to complex systems like the spherical pendulum and coupled oscillators.

## 1.1 The Principle of Least Action

In Newtonian mechanics, we typically analyze forces $\vec{F} = m\vec{a}$. However, for systems with constraints, Hamilton's Principle provides a more elegant framework. We define the **Lagrangian** $L$ as the difference between kinetic energy $T$ and potential energy $V$:

$$
L = T - V
$$

The action $\mathcal{S}$ is defined as the integral of the Lagrangian over time:

$$
\mathcal{S} = \int_{t_1}^{t_2} L(q_i, \dot{q}_i, t) dt
$$

where $q_i$ are the generalized coordinates. The principle states that the actual path taken by the system is the one that makes the action stationary ($\delta \mathcal{S} = 0$).



### 1.1.1 Derivation of Euler-Lagrange Equations

To find the path that minimizes the action, we apply the calculus of variations. For a single coordinate $q$, the variation of the action is:

$$
\delta \mathcal{S} = \int_{t_1}^{t_2} \left( \frac{\partial L}{\partial q} \delta q + \frac{\partial L}{\partial \dot{q}} \delta \dot{q} \right) dt = 0
$$

By applying integration by parts to the second term and assuming the endpoints are fixed ($\delta q(t_1) = \delta q(t_2) = 0$), we arrive at the fundamental **Euler-Lagrange Equation**:

$$
\frac{d}{dt} \left( \frac{\partial L}{\partial \dot{q}_i} \right) - \frac{\partial L}{\partial q_i} = 0 \quad (1.1)
$$

> **Exercise 1.1** Consider a free particle in 3D space with mass $m$. The potential $V=0$. Write the Lagrangian in Cartesian coordinates and show that the Euler-Lagrange equations recover Newton's First Law: $m\ddot{x} = 0, m\ddot{y} = 0, m\ddot{z} = 0$.

---

## 1.2 Central Force Motion and Orbitals

One of the most powerful applications of Lagrangian mechanics is the reduction of the two-body problem to a one-body problem using reduced mass $\mu$.

### 1.2.1 The Two-Body Lagrangian

Given two masses $m_1$ and $m_2$ interacting via a central potential $V(r)$, the Lagrangian in polar coordinates $(r, \theta)$ is:

$$
L = \frac{1}{2}\mu(\dot{r}^2 + r^2\dot{\theta}^2) - V(r)
$$

where the reduced mass is defined as:

$$
\mu = \frac{m_1 m_2}{m_1 + m_2}
$$



### 1.2.2 Conservation Laws

From equation (1.1), we can identify conserved quantities (Noether's Theorem). If the Lagrangian does not depend on a specific coordinate $q_i$ (a "cyclic" coordinate), then the conjugate momentum $p_i$ is conserved:

$$
p_\theta = \frac{\partial L}{\partial \dot{\theta}} = \mu r^2 \dot{\theta} = \ell \quad (\text{Angular Momentum})
$$

The radial equation of motion then becomes:

$$
\mu \ddot{r} = -\frac{dV}{dr} + \frac{\ell^2}{\mu r^3} = -\frac{d V_{eff}}{dr}
$$

where $V_{eff}$ is the effective potential:

$$
V_{eff}(r) = V(r) + \frac{\ell^2}{2\mu r^2} \quad (1.2)
$$

| Potential Type | Force Law | Expected Orbit |
| :--- | :--- | :--- |
| Gravitational | $-GmM/r$ | Elliptic/Hyperbolic |
| Harmonic | $\frac{1}{2}kr^2$ | Isotropic Ellipse |
| Centrifugal | $\ell^2/2\mu r^2$ | Repulsive |

---

## 1.3 Small Oscillations and Coupled Systems

For a system near a stable equilibrium point $q_0$, we can approximate the potential using a Taylor expansion:

$$
V(q) \approx V(q_0) + V'(q_0)(q-q_0) + \frac{1}{2}V''(q_0)(q-q_0)^2
$$

Since $V'(q_0) = 0$ at equilibrium, the system behaves like a simple harmonic oscillator.

### 1.3.1 The Double Pendulum

The double pendulum is a classic example of a system that exhibits chaotic behavior at high energies but behaves linearly at low amplitudes. The Lagrangian for lengths $l_1, l_2$ and masses $m_1, m_2$ is:

$$
L = \frac{1}{2}(m_1+m_2)l_1^2\dot{\theta}_1^2 + \frac{1}{2}m_2l_2^2\dot{\theta}_2^2 + m_2l_1l_2\dot{\theta}_1\dot{\theta}_2\cos(\theta_1-\theta_2) + (m_1+m_2)gl_1\cos\theta_1 + m_2gl_2\cos\theta_2
$$



> **Exercise 1.2** Linearize the double pendulum equations for small $\theta_1, \theta_2$. Show that the normal mode frequencies $\omega$ satisfy the secular equation:
> $$\det(\mathbf{K} - \omega^2 \mathbf{M}) = 0$$
> where $\mathbf{M}$ is the mass matrix and $\mathbf{K}$ is the stiffness matrix.

---

## 1.4 Hamiltonian Mechanics and Phase Space

The Hamiltonian $H$ is the Legendre transform of the Lagrangian, shifting the focus from $(q, \dot{q})$ to $(q, p)$.

$$
H(q, p, t) = \sum p_i \dot{q}_i - L
$$

The equations of motion are now first-order differential equations:

$$
\dot{q}_i = \frac{\partial H}{\partial p_i}, \quad \dot{p}_i = -\frac{\partial H}{\partial q_i} \quad (1.3)
$$

### Comparison Table

| Feature | Lagrangian Mechanics | Hamiltonian Mechanics |
| :--- | :--- | :--- |
| **Variables** | $q, \dot{q}$ (Configuration Space) | $q, p$ (Phase Space) |
| **Order** | $n$ Second-order ODEs | $2n$ First-order ODEs |
| **Foundation** | Energy Extremization | Flow in Phase Space |
| **Geometry** | Tangent Bundle | Cotangent Bundle |

> **Remark 1.1** In many physical systems, $H$ represents the total energy $T+V$. This is true if the transformation to generalized coordinates is time-independent and the potential is velocity-independent.

### 1.4.1 Poisson Brackets

The evolution of any observable $A(q, p)$ can be expressed using Poisson Brackets:

$$
\{A, H\} = \sum \left( \frac{\partial A}{\partial q_i} \frac{\partial H}{\partial p_i} - \frac{\partial A}{\partial p_i} \frac{\partial H}{\partial q_i} \right)
$$

$$
\frac{dA}{dt} = \{A, H\} + \frac{\partial A}{\partial t}
$$

This formulation is the direct precursor to the Heisenberg picture in quantum mechanics, where $\{A, B\} \rightarrow \frac{1}{i\hbar}[\hat{A}, \hat{B}]$.

---

## 1.5 Dissipative Systems (Extensions)

In the presence of non-conservative forces like friction, we introduce the **Rayleigh Dissipation Function** $\mathcal{R}$:

$$
\mathcal{R} = \frac{1}{2} \sum_{i,j} c_{ij} \dot{q}_i \dot{q}_j
$$

The modified Euler-Lagrange equation becomes:

$$
\frac{d}{dt} \left( \frac{\partial L}{\partial \dot{q}_i} \right) - \frac{\partial L}{\partial q_i} + \frac{\partial \mathcal{R}}{\partial \dot{q}_i} = 0
$$

This allows for the modeling of damped harmonic oscillators and fluid resistance within the same variational framework.