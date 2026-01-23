import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Info, ArrowDown, ArrowUp, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function TaxPolicyPage() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState([]);

  const taxPolicies = [
    {
      id: 1,
      title: "Income Tax Policy",
      content: [
        "Individuals earning up to NPR 400,000 per year: 1% tax",
        "NPR 400,001 - 500,000: 10% tax",
        "NPR 500,001 - 700,000: 20% tax",
        "Above NPR 700,000: 30% tax",
        "Annual filing of income tax return is mandatory.",
        "Deductions available for retirement contributions and health insurance.",
      ],
    },
    {
      id: 2,
      title: "Property Tax Policy",
      content: [
        "Residential property: 0.2% - 0.5% of annual property value",
        "Commercial property: 0.5% - 1% of annual property value",
        "Owners must submit annual property valuation to ward office.",
        "Late payment incurs 10% penalty of tax amount.",
      ],
    },
    {
      id: 3,
      title: "Value Added Tax (VAT) Policy",
      content: [
        "Applicable to goods/services sold above NPR 5,000 per month.",
        "Standard VAT rate: 13% of the sale price.",
        "VAT-registered businesses must file monthly or quarterly returns.",
        "Input tax can be claimed as credit against output tax.",
      ],
    },
    {
      id: 4,
      title: "Business Tax Policy",
      content: [
        "Small businesses with annual turnover < NPR 5 million: 3% tax.",
        "Medium businesses with annual turnover NPR 5-50 million: 5% tax.",
        "Large businesses > NPR 50 million: 10% tax.",
        "Businesses must submit annual business tax return.",
        "Failure to pay may result in penalties or license suspension.",
      ],
    },
    {
      id: 5,
      title: "Tax Penalty and Compliance Policy",
      content: [
        "Late payment of taxes: 10% penalty + 1% monthly interest.",
        "Failure to file tax returns: NPR 5,000 fine per missing return.",
        "Non-compliance may lead to legal action or seizure of assets.",
        "Keep receipts and documentation for audit purposes.",
      ],
    },
  ];

  const toggleSection = (id) => {
    if (expandedSections.includes(id)) {
      setExpandedSections(expandedSections.filter((sectionId) => sectionId !== id));
    } else {
      setExpandedSections([...expandedSections, id]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      {/* Header with Back Button */}
      <View className="flex-row items-center mt-6 mb-4">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="bg-[#003083] p-3 rounded-full"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-2xl font-bold text-[#003083] text-center ml-2 mr-2">
          Nepal Tax Policies
        </Text>
      </View>

      <Text className="text-gray-600 text-center mb-5">
        Detailed overview of Nepalese tax policies and rates
      </Text>

      {/* Tax Policy Sections */}
      {taxPolicies.map((policy) => {
        const isExpanded = expandedSections.includes(policy.id);

        return (
          <View
            key={policy.id}
            className="bg-white rounded-2xl shadow-md mb-6 p-4"
          >
            {/* Section Title */}
            <View className="flex-row items-center mb-2">
              <Info size={20} color="#4F6F52" />
              <Text className="text-lg font-semibold ml-2">{policy.title}</Text>
            </View>

            {/* Content */}
            {isExpanded && (
              <View className="bg-[#4F6F52]/10 rounded-xl p-3 mb-3">
                {policy.content.map((item, index) => (
                  <Text key={index} className="text-gray-700 ml-2 mb-1">
                    • {item}
                  </Text>
                ))}
              </View>
            )}

            {/* Expand/Collapse Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-[#003083] py-3 rounded-xl mt-1 flex-row items-center justify-center"
              onPress={() => toggleSection(policy.id)}
            >
              <Text className="text-white font-medium mr-2">
                {isExpanded ? "View Less" : "View More"}
              </Text>
              {isExpanded ? (
                <ArrowUp size={18} color="white" />
              ) : (
                <ArrowDown size={18} color="white" />
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}
