"use client";

interface Props {
  selectedCountry: string;
  stationCounts: Record<string, number>;
  onSelectCountry: (code: string) => void;
}

const COUNTRY_NAMES: Record<string, string> = {
  AF:"Afghanistan",AL:"Albania",DZ:"Algeria",AO:"Angola",AR:"Argentina",AU:"Australia",
  AT:"Austria",BD:"Bangladesh",BE:"Belgium",BO:"Bolivia",BR:"Brazil",BG:"Bulgaria",
  MM:"Myanmar",KH:"Cambodia",CM:"Cameroon",CA:"Canada",LK:"Sri Lanka",CL:"Chile",
  CN:"China",CO:"Colombia",CD:"DR Congo",CR:"Costa Rica",CZ:"Czech Republic",
  DK:"Denmark",DO:"Dominican Rep.",EC:"Ecuador",EG:"Egypt",ET:"Ethiopia",FI:"Finland",
  FR:"France",DE:"Germany",GH:"Ghana",GR:"Greece",GT:"Guatemala",GN:"Guinea",
  HT:"Haiti",HN:"Honduras",HU:"Hungary",IN:"India",ID:"Indonesia",IR:"Iran",
  IQ:"Iraq",IE:"Ireland",IL:"Israel",IT:"Italy",JM:"Jamaica",JP:"Japan",
  JO:"Jordan",KE:"Kenya",KP:"North Korea",KR:"South Korea",KW:"Kuwait",
  LA:"Laos",LB:"Lebanon",MA:"Morocco",MX:"Mexico",MN:"Mongolia",MZ:"Mozambique",
  NP:"Nepal",NL:"Netherlands",NI:"Nicaragua",NG:"Nigeria",NO:"Norway",PK:"Pakistan",
  PA:"Panama",PE:"Peru",PH:"Philippines",PL:"Poland",PT:"Portugal",RO:"Romania",
  RU:"Russia",SA:"Saudi Arabia",SN:"Senegal",SO:"Somalia",ZA:"South Africa",
  ES:"Spain",SE:"Sweden",CH:"Switzerland",SY:"Syria",TH:"Thailand",TN:"Tunisia",
  TR:"Turkey",UG:"Uganda",UA:"Ukraine",AE:"UAE",GB:"United Kingdom",US:"United States",
  UY:"Uruguay",UZ:"Uzbekistan",VE:"Venezuela",VN:"Vietnam",YE:"Yemen",ZM:"Zambia",
  ZW:"Zimbabwe",BT:"Bhutan",NZ:"New Zealand",
};

function getColor(count: number): string {
  if (count === 0) return "bg-gray-800 text-gray-600 border-gray-700";
  if (count < 10) return "bg-blue-900/60 text-blue-300 border-blue-700/50 hover:bg-blue-800/60";
  if (count < 50) return "bg-indigo-900/60 text-indigo-300 border-indigo-700/50 hover:bg-indigo-800/60";
  if (count < 100) return "bg-violet-900/60 text-violet-300 border-violet-700/50 hover:bg-violet-800/60";
  return "bg-purple-900/60 text-purple-300 border-purple-700/50 hover:bg-purple-800/60";
}

export default function WorldMap({ selectedCountry, stationCounts, onSelectCountry }: Props) {
  const countries = Object.entries(COUNTRY_NAMES).sort((a, b) =>
    (stationCounts[b[0]] || 0) - (stationCounts[a[0]] || 0)
  );

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gray-900/50 p-4">
      {/* Legend */}
      <div className="mb-4 flex items-center gap-3 text-xs text-gray-500">
        <span>Stations:</span>
        {[
          { color: "bg-gray-800", label: "0" },
          { color: "bg-blue-900", label: "1-9" },
          { color: "bg-indigo-900", label: "10-49" },
          { color: "bg-violet-900", label: "50-99" },
          { color: "bg-purple-900", label: "100+" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`h-3 w-3 rounded-sm ${color}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Country grid */}
      <div className="grid max-h-[420px] grid-cols-3 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {countries.map(([code, name]) => {
          const count = stationCounts[code] || 0;
          const isSelected = selectedCountry === code;
          return (
            <button
              key={code}
              onClick={() => onSelectCountry(isSelected ? "" : code)}
              disabled={count === 0}
              className={`rounded-lg border px-2 py-2 text-left transition-all ${
                isSelected
                  ? "border-orange-500 bg-orange-500/20 text-orange-300"
                  : getColor(count)
              } ${count === 0 ? "cursor-default opacity-40" : "cursor-pointer"}`}
            >
              <p className="truncate text-xs font-medium leading-tight">{name}</p>
              {count > 0 && (
                <p className={`text-xs font-bold ${isSelected ? "text-orange-400" : "text-gray-400"}`}>
                  {count}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-gray-600">
        Click any country to filter stations · Scroll to see all
      </p>
    </div>
  );
}
