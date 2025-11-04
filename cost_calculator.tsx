import React, { useState, useEffect } from 'react';
import { Plus, Trash2, User, Calculator, Save, FolderOpen, History, Download, Edit2, Check, X, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function BusinessQuoteApp() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [projectName, setProjectName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState([{ id: 1, name: '', cost: '' }]);
  const [customerType, setCustomerType] = useState('regular');
  const [customMargin, setCustomMargin] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [quoteHistory, setQuoteHistory] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const templatesData = await window.storage.get('templates');
      const historyData = await window.storage.get('quote-history');
      
      if (templatesData) {
        setSavedTemplates(JSON.parse(templatesData.value));
      } else {
        // Set default templates
        const defaults = getDefaultTemplates();
        setSavedTemplates(defaults);
        await window.storage.set('templates', JSON.stringify(defaults));
      }
      
      if (historyData) {
        setQuoteHistory(JSON.parse(historyData.value));
      }
    } catch (error) {
      // First time or no data
      const defaults = getDefaultTemplates();
      setSavedTemplates(defaults);
    }
  };

  const getDefaultTemplates = () => [
    {
      id: 'bc500',
      name: 'Business Card (500)',
      items: [
        { name: 'Design', cost: '50' },
        { name: 'Print', cost: '' },
        { name: 'Lamination', cost: '' },
        { name: 'Cutting', cost: '' },
        { name: 'Box', cost: '' },
        { name: 'Delivery', cost: '' }
      ]
    },
    {
      id: 'sticker',
      name: 'Sticker',
      items: [
        { name: 'Design', cost: '50' },
        { name: 'Gum Sheet', cost: '' },
        { name: 'Print', cost: '' },
        { name: 'Cutting', cost: '' },
        { name: 'Delivery', cost: '' }
      ]
    },
    {
      id: 'flex',
      name: 'Flex Banner',
      items: [
        { name: 'Design', cost: '50' },
        { name: 'Vinyl (sq.ft)', cost: '' },
        { name: 'Print', cost: '' },
        { name: 'Finishing/Eyelets', cost: '' },
        { name: 'Delivery', cost: '' }
      ]
    },
    {
      id: 'book',
      name: 'Book Printing',
      items: [
        { name: 'Design', cost: '' },
        { name: 'Paper', cost: '' },
        { name: 'Print', cost: '' },
        { name: 'Binding', cost: '' },
        { name: 'Cover', cost: '' },
        { name: 'Delivery', cost: '' }
      ]
    },
    {
      id: 'attar',
      name: 'Attar/Perfume',
      items: [
        { name: 'Attar/Oil', cost: '' },
        { name: 'Bottle', cost: '' },
        { name: 'Packaging', cost: '' },
        { name: 'Label', cost: '' },
        { name: 'Delivery', cost: '' }
      ]
    }
  ];

  const customers = {
    budget: { name: 'Budget', margin: 8, color: 'blue' },
    regular: { name: 'Regular', margin: 18, color: 'green' },
    premium: { name: 'Premium', margin: 30, color: 'purple' },
    walkin: { name: 'Walk-in', margin: 22, color: 'orange' }
  };

  const loadTemplate = (template) => {
    setProjectName(template.name);
    setItems(template.items.map((item, idx) => ({
      id: Date.now() + idx,
      name: item.name,
      cost: item.cost
    })));
  };

  const saveAsTemplate = async () => {
    if (!templateName.trim()) return;
    
    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      items: items.map(item => ({ name: item.name, cost: item.cost }))
    };

    const updated = [...savedTemplates, newTemplate];
    setSavedTemplates(updated);
    await window.storage.set('templates', JSON.stringify(updated));
    setShowSaveModal(false);
    setTemplateName('');
  };

  const deleteTemplate = async (id) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    await window.storage.set('templates', JSON.stringify(updated));
  };

  const saveQuote = async () => {
    const quote = {
      id: Date.now(),
      date: new Date().toLocaleString('en-IN'),
      projectName: projectName || 'Untitled',
      customerName: customerName || 'Walk-in',
      customerPhone,
      items: items.filter(i => i.name),
      customerType,
      margin,
      totalCost,
      quotedPrice,
      profit
    };

    const updated = [quote, ...quoteHistory];
    setQuoteHistory(updated);
    await window.storage.set('quote-history', JSON.stringify(updated));
    
    // Reset form
    setProjectName('');
    setCustomerName('');
    setCustomerPhone('');
    setItems([{ id: Date.now(), name: '', cost: '' }]);
    setCustomMargin('');
    
    alert('Quote saved successfully!');
  };

  const deleteQuote = async (id) => {
    const updated = quoteHistory.filter(q => q.id !== id);
    setQuoteHistory(updated);
    await window.storage.set('quote-history', JSON.stringify(updated));
  };

  const loadQuote = (quote) => {
    setProjectName(quote.projectName);
    setCustomerName(quote.customerName);
    setCustomerPhone(quote.customerPhone);
    setItems(quote.items.map((item, idx) => ({
      id: Date.now() + idx,
      name: item.name,
      cost: item.cost.toString()
    })));
    setCustomerType(quote.customerType);
    setActiveTab('calculator');
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', cost: '' }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalCost = items.reduce((sum, item) => 
    sum + (parseFloat(item.cost) || 0), 0
  );

  const margin = customMargin ? parseFloat(customMargin) : customers[customerType].margin;
  const quotedPrice = totalCost > 0 ? totalCost / (1 - margin / 100) : 0;
  const profit = quotedPrice - totalCost;

  const formatINR = (num) => {
    if (!num || isNaN(num) || num === 0) return '₹0';
    return '₹' + Math.round(num).toLocaleString('en-IN');
  };

  const exportQuote = () => {
    const text = `
QUOTATION
${'-'.repeat(40)}
Project: ${projectName || 'Untitled'}
Customer: ${customerName || 'Walk-in'}
Phone: ${customerPhone || '-'}
Date: ${new Date().toLocaleDateString('en-IN')}

ITEMS:
${items.filter(i => i.name).map((item, idx) => 
  `${idx + 1}. ${item.name}: ${formatINR(parseFloat(item.cost))}`
).join('\n')}

${'-'.repeat(40)}
Total Amount: ${formatINR(quotedPrice)}
${'-'.repeat(40)}

Thank you for your business!
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quote_${projectName || 'Untitled'}_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Business Quote Manager</h1>
                <p className="text-sm text-gray-500">Professional quotation & cost calculator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'calculator', icon: Calculator, label: 'Calculator' },
              { id: 'templates', icon: Package, label: 'Templates' },
              { id: 'history', icon: History, label: 'History' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project/Product Name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Templates */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Load Template</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {savedTemplates.slice(0, 6).map(template => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      className="px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition text-left"
                    >
                      <div className="font-medium text-indigo-900 text-sm">{template.name}</div>
                      <div className="text-xs text-indigo-600">{template.items.length} items</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Cost Breakdown</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save Template
                    </button>
                    <button
                      onClick={addItem}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <span className="text-gray-400 font-medium w-8">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Item description"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="number"
                        value={item.cost}
                        onChange={(e) => updateItem(item.id, 'cost', e.target.value)}
                        placeholder="Cost"
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-right"
                      />
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Cost</span>
                  <span className="text-3xl font-bold text-gray-900">{formatINR(totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              
              {/* Customer Type */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Customer Type</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {Object.entries(customers).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCustomerType(key);
                        setCustomMargin('');
                      }}
                      className={`px-4 py-3 rounded-lg font-medium transition ${
                        customerType === key
                          ? `bg-${data.color}-500 text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-sm">{data.name}</div>
                      <div className="text-xs opacity-90">{data.margin}%</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Margin %</label>
                  <input
                    type="number"
                    value={customMargin}
                    onChange={(e) => setCustomMargin(e.target.value)}
                    placeholder="Override default margin"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Quote Result */}
              <div className={`bg-gradient-to-br from-${customers[customerType].color}-500 to-${customers[customerType].color}-600 rounded-lg shadow-xl p-6 text-white`}>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-6 h-6" />
                  <h2 className="text-lg font-semibold uppercase">Final Quote</h2>
                </div>
                
                <div className="text-5xl font-bold mb-6">{formatINR(quotedPrice)}</div>
                
                <div className="space-y-3 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex justify-between text-sm">
                    <span>Total Cost:</span>
                    <span className="font-semibold">{formatINR(totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Your Profit:</span>
                    <span className="font-semibold">{formatINR(profit)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/30 pt-3">
                    <span className="font-medium">Margin:</span>
                    <span className="text-xl font-bold">{margin.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={saveQuote}
                    disabled={totalCost === 0}
                    className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Quote
                  </button>
                  <button
                    onClick={exportQuote}
                    disabled={totalCost === 0}
                    className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-3 rounded-lg hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export Quote
                  </button>
                </div>
              </div>

              {/* Quick Compare */}
              {totalCost > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase">Margin Comparison</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[8, 15, 20, 25, 30, 35].map(m => {
                      const price = totalCost / (1 - m / 100);
                      const prof = price - totalCost;
                      return (
                        <div key={m} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{m}%:</span>
                          <div className="text-right">
                            <div className="font-semibold text-gray-800">{formatINR(price)}</div>
                            <div className="text-xs text-green-600">+{formatINR(prof)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Templates</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTemplates.map(template => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {template.items.length} items
                  </div>
                  <button
                    onClick={() => {
                      loadTemplate(template);
                      setActiveTab('calculator');
                    }}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    Load Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quote History</h2>
            {quoteHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No quotes saved yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quoteHistory.map(quote => (
                  <div key={quote.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{quote.projectName}</h3>
                        <p className="text-sm text-gray-600">{quote.customerName} • {quote.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{formatINR(quote.quotedPrice)}</div>
                        <div className="text-sm text-green-600">Profit: {formatINR(quote.profit)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadQuote(quote)}
                        className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                      >
                        Load Quote
                      </button>
                      <button
                        onClick={() => deleteQuote(quote.id)}
                        className="px-4 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Save as Template</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setTemplateName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveAsTemplate}
                disabled={!templateName.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}