// All 50 US States with full names and primary regional cities/metros for localized sisterhood filtering

export interface UsStateInfo {
  code: string;
  name: string;
  majorCities: string[];
}

export const US_STATES_DATA: UsStateInfo[] = [
  { code: 'AL', name: 'Alabama', majorCities: ['Birmingham', 'Huntsville', 'Mobile', 'Montgomery', 'Tuscaloosa', 'Auburn'] },
  { code: 'AK', name: 'Alaska', majorCities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Wasilla'] },
  { code: 'AZ', name: 'Arizona', majorCities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Flagstaff'] },
  { code: 'AR', name: 'Arkansas', majorCities: ['Little Rock', 'Fayetteville', 'Fort Smith', 'Springdale', 'Jonesboro'] },
  { code: 'CA', name: 'California', majorCities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Oakland', 'Sacramento', 'Fresno', 'Long Beach'] },
  { code: 'CO', name: 'Colorado', majorCities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder', 'Pueblo'] },
  { code: 'CT', name: 'Connecticut', majorCities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury', 'Danbury'] },
  { code: 'DE', name: 'Delaware', majorCities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'] },
  { code: 'FL', name: 'Florida', majorCities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee', 'St. Petersburg', 'Fort Lauderdale', 'Pensacola'] },
  { code: 'GA', name: 'Georgia', majorCities: ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Macon', 'Athens', 'Decatur', 'Marietta', 'Alpharetta'] },
  { code: 'HI', name: 'Hawaii', majorCities: ['Honolulu', 'Hilo', 'Kailua', 'Kapolei', 'Kaneohe'] },
  { code: 'ID', name: 'Idaho', majorCities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'] },
  { code: 'IL', name: 'Illinois', majorCities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Peoria'] },
  { code: 'IN', name: 'Indiana', majorCities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Bloomington'] },
  { code: 'IA', name: 'Iowa', majorCities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'] },
  { code: 'KS', name: 'Kansas', majorCities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence'] },
  { code: 'KY', name: 'Kentucky', majorCities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'] },
  { code: 'LA', name: 'Louisiana', majorCities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Monroe'] },
  { code: 'ME', name: 'Maine', majorCities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'] },
  { code: 'MD', name: 'Maryland', majorCities: ['Baltimore', 'Silver Spring', 'Columbia', 'Germantown', 'Annapolis', 'Bethesda', 'Frederick'] },
  { code: 'MA', name: 'Massachusetts', majorCities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton'] },
  { code: 'MI', name: 'Michigan', majorCities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint'] },
  { code: 'MN', name: 'Minnesota', majorCities: ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park'] },
  { code: 'MS', name: 'Mississippi', majorCities: ['Jackson', 'Gulfport', 'Southaven', 'Biloxi', 'Hattiesburg', 'Tupelo'] },
  { code: 'MO', name: 'Missouri', majorCities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'] },
  { code: 'MT', name: 'Montana', majorCities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Helena'] },
  { code: 'NE', name: 'Nebraska', majorCities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'] },
  { code: 'NV', name: 'Nevada', majorCities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City'] },
  { code: 'NH', name: 'New Hampshire', majorCities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover'] },
  { code: 'NJ', name: 'New Jersey', majorCities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton', 'Camden', 'Atlantic City'] },
  { code: 'NM', name: 'New Mexico', majorCities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'] },
  { code: 'NY', name: 'New York', majorCities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'White Plains'] },
  { code: 'NC', name: 'North Carolina', majorCities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Asheville', 'Wilmington'] },
  { code: 'ND', name: 'North Dakota', majorCities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'] },
  { code: 'OH', name: 'Ohio', majorCities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'] },
  { code: 'OK', name: 'Oklahoma', majorCities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton'] },
  { code: 'OR', name: 'Oregon', majorCities: ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Bend'] },
  { code: 'PA', name: 'Pennsylvania', majorCities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Harrisburg'] },
  { code: 'RI', name: 'Rhode Island', majorCities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'] },
  { code: 'SC', name: 'South Carolina', majorCities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Spartanburg'] },
  { code: 'SD', name: 'South Dakota', majorCities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'] },
  { code: 'TN', name: 'Tennessee', majorCities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro'] },
  { code: 'TX', name: 'Texas', majorCities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano'] },
  { code: 'UT', name: 'Utah', majorCities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy'] },
  { code: 'VT', name: 'Vermont', majorCities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'] },
  { code: 'VA', name: 'Virginia', majorCities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke'] },
  { code: 'WA', name: 'Washington', majorCities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Olympia'] },
  { code: 'WV', name: 'West Virginia', majorCities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'] },
  { code: 'WI', name: 'Wisconsin', majorCities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton'] },
  { code: 'WY', name: 'Wyoming', majorCities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs'] }
];

export function getStateName(code: string): string {
  const found = US_STATES_DATA.find(s => s.code.toUpperCase() === code.toUpperCase());
  return found ? found.name : code;
}

export function getStateCities(code: string): string[] {
  const found = US_STATES_DATA.find(s => s.code.toUpperCase() === code.toUpperCase());
  return found ? found.majorCities : [];
}
