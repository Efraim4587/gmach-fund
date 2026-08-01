import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable static rendering for this page

export default async function Home() {
  const { data: members, error } = await supabase.from('members').select('*');
  const { data: valuations } = await supabase.from('valuations').select('*').order('valuation_date', { ascending: false }).limit(1);

  const activeValuation = valuations?.[0] || { unit_price: 100, portfolio_value: 0, total_units: 0 };
  const safeMembers = members || [];

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gmach / קרן השקעות</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-gray-500 mb-1">Total Portfolio Value (₪)</h2>
            <p className="text-3xl font-bold">{Number(activeValuation.portfolio_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-gray-500 mb-1">Active Unit Price (₪)</h2>
            <p className="text-3xl font-bold text-blue-600">{Number(activeValuation.unit_price).toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-gray-500 mb-1">Total Units</h2>
            <p className="text-3xl font-bold">{Number(activeValuation.total_units).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Members / חברים</h2>
          </div>
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Commission Rate</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {safeMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">No members found.</td>
                </tr>
              ) : (
                safeMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">{member.member_code}</td>
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4">{member.commission_rate}%</td>
                    <td className="p-4 text-gray-500">{new Date(member.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
