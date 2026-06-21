import type { Story, SpecData } from '../types';

export const initialStories: Story[] = [
  {
    id: 1,
    role: 'Accounts Payable Clerk',
    goal: 'capture vendor invoices accurately',
    benefit: 'reduce manual effort and errors',
    criteria:
      'Given a valid invoice, when it is captured, then it is validated and saved successfully.',
  },
  {
    id: 2,
    role: 'Accounts Payable Manager',
    goal: 'review and approve invoices',
    benefit: 'ensure compliance and control',
    criteria:
      'Given a captured invoice, when I review and approve it, then it is ready for posting.',
  },
  {
    id: 3,
    role: 'Finance Reporter',
    goal: 'view invoice and payment reports',
    benefit: 'monitor spend and cash flow',
    criteria:
      'Given posted invoices, when I run reports, then the data is accurate and up to date.',
  },
];

export const initialData: SpecData = {
  module: 'Finance (FI)',
  project: 'S/4HANA Finance Transformation',
  title: 'Vendor Invoice Management',
  process: 'Accounts Payable',
  author: 'Jane Consultant',
  version: '1.0',
  requirement:
    'The company needs a streamlined process for managing vendor invoices in SAP S/4HANA. The solution must enable invoice capture, validation, posting, and reporting with proper controls and auditability. It should integrate with purchase orders and support automated invoice data extraction to improve efficiency and accuracy.',
  inScope:
    'Invoice capture, validation, approval, posting, exception handling, and operational reporting.',
  outScope: 'Vendor onboarding, payment execution, and legacy invoice migration.',
  assumptions:
    'Business partners and purchase orders are available in S/4HANA. Standard SAP workflow is enabled.',
  dependencies: 'SAP Business Workflow, MM purchase order integration, and role provisioning.',
  stories: initialStories,
};
