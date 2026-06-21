import type { SpecData, Section } from '../types';

export function buildSections(data: SpecData): Section[] {
  const storyRows = data.stories
    .map(
      (s, i) =>
        `${i + 1}. As a ${s.role || 'user'}, I want to ${s.goal || 'complete the process'}, so that I can ${s.benefit || 'achieve the business outcome'}.\nAcceptance criteria: ${s.criteria || 'To be confirmed during design validation.'}`,
    )
    .join('\n\n');
  return [
    {
      id: 'purpose',
      number: '1.0',
      title: 'Purpose and objectives',
      content: `This Functional Specification defines the ${data.title} solution for the ${data.process} process within SAP ${data.module}. The objective is to translate the approved business requirement into a functional design that can be configured, developed, tested, and accepted.\n\nBusiness requirement\n${data.requirement}`,
    },
    {
      id: 'scope',
      number: '2.0',
      title: 'Scope',
      content: `In scope\n${data.inScope}\n\nOut of scope\n${data.outScope}`,
    },
    {
      id: 'process',
      number: '3.0',
      title: 'Proposed functional process',
      content: `The proposed solution will support the end-to-end ${data.process} process in ${data.module}. Users will initiate and process transactions using assigned business roles. The solution will validate mandatory data, apply configured business rules, route exceptions or approvals where required, post eligible transactions, and retain status and change information for auditability.\n\nThe design should favor standard SAP S/4HANA capability. Any identified gap requiring enhancement will be documented with its technical object and interface contract before build approval.`,
    },
    {
      id: 'stories',
      number: '4.0',
      title: 'User stories and acceptance criteria',
      content: storyRows,
    },
    {
      id: 'rules',
      number: '5.0',
      title: 'Functional requirements and business rules',
      content: `FR-01 — The solution shall support creation and processing of ${data.title.toLowerCase()} transactions.\nFR-02 — Mandatory fields and master-data references shall be validated before save or posting.\nFR-03 — Authorization checks shall use assigned SAP business roles.\nFR-04 — Processing errors shall display actionable messages and preserve entered data.\nFR-05 — Status, user, date, and time shall be retained for audit-relevant actions.\nFR-06 — Reporting shall expose transaction status and key process measures to authorized users.`,
    },
    {
      id: 'integration',
      number: '6.0',
      title: 'Integration and data',
      content: `Dependencies\n${data.dependencies}\n\nThe solution will use released SAP integration patterns and existing master data wherever available. Interface field mapping, frequency, error handling, ownership, and reconciliation controls must be confirmed during detailed design. No direct database updates are permitted.`,
    },
    {
      id: 'security',
      number: '7.0',
      title: 'Security, controls, and audit',
      content: `Access will follow least-privilege and segregation-of-duties principles. Display, create, change, approve, post, and report permissions must be mapped to business roles. Sensitive data must follow the project's classification and retention policies. Material process actions and configuration changes must be traceable.`,
    },
    {
      id: 'errors',
      number: '8.0',
      title: 'Exception handling',
      content: `Validation failures must identify the affected field and corrective action. Integration failures must be logged with a correlation reference and support safe reprocessing. Duplicate processing must be prevented through appropriate business keys. Unresolved exceptions will be routed to the designated process owner.`,
    },
    {
      id: 'test',
      number: '9.0',
      title: 'Test scenarios',
      content: data.stories
        .map(
          (s, i) =>
            `TS-${String(i + 1).padStart(2, '0')} — ${s.role}: ${s.goal}\nExpected result: ${s.criteria}`,
        )
        .join('\n\n'),
    },
    {
      id: 'assumptions',
      number: '10.0',
      title: 'Assumptions and open decisions',
      content: `Assumptions\n${data.assumptions}\n\nOpen decisions\n• Confirm final organization structure, business roles, and approval thresholds.\n• Confirm reporting fields and retention period.\n• Confirm whether any requirement cannot be met with standard SAP capability.`,
    },
  ];
}
