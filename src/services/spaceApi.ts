import { Mission, LaunchData } from '../types/Mission';

const SPACEX_API_BASE = 'https://api.spacexdata.com/v4';

export class SpaceApiService {
  static async fetchSpaceXLaunches(limit: number = 30): Promise<Mission[]> {
    try {
      const response = await fetch(`${SPACEX_API_BASE}/launches?limit=${limit}&sort=-date_utc`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const launches = await response.json();
      
      const missions = await this.transformSpaceXData(launches);
      return missions;
    } catch (error) {
      return this.getFallbackMissions();
    }
  }

  private static async transformSpaceXData(launches: any[]): Promise<Mission[]> {
    const missions: Mission[] = [];
    
    for (const launch of launches) {
      try {
        const rocket = await this.fetchRocket(launch.rocket);
        const launchpad = await this.fetchLaunchpad(launch.launchpad);
        
        const mission: Mission = {
          id: launch.id || `spacex-${missions.length}`,
          name: launch.name || 'Unknown Mission',
          date: launch.date_utc || new Date().toISOString(),
          agency: 'SpaceX',
          type: this.determineMissionType(launch),
          description: launch.details || `SpaceX ${launch.name} mission`,
          status: this.determineStatus(launch),
          rocket: rocket?.name || 'Unknown Rocket',
          launchSite: launchpad?.full_name || launchpad?.name || 'Unknown Launch Site',
          missionPatch: launch.links?.patch?.small || launch.links?.patch?.large,
          image: launch.links?.flickr?.original?.[0] || launch.links?.webcast,
          success: launch.success,
          crew: launch.crew || [],
          details: launch.details
        };
        
        missions.push(mission);
      } catch (error) {
      }
    }
    
    return missions;
  }

  private static async fetchRocket(rocketId: string): Promise<any> {
    try {
      const response = await fetch(`${SPACEX_API_BASE}/rockets/${rocketId}`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  private static async fetchLaunchpad(launchpadId: string): Promise<any> {
    try {
      const response = await fetch(`${SPACEX_API_BASE}/launchpads/${launchpadId}`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  private static determineMissionType(launch: any): Mission['type'] {
    const name = launch.name?.toLowerCase() || '';
    const details = launch.details?.toLowerCase() || '';
    
    if (launch.crew && launch.crew.length > 0) return 'crewed';
    if (name.includes('starlink')) return 'launch';
    if (name.includes('dragon') && name.includes('crew')) return 'crewed';
    if (details.includes('landing') || details.includes('land')) return 'landing';
    if (details.includes('orbit')) return 'orbit';
    if (details.includes('flyby')) return 'flyby';
    if (name.includes('falcon heavy')) return 'launch';
    
    return 'launch';
  }

  private static determineStatus(launch: any): Mission['status'] {
    const now = new Date();
    const launchDate = new Date(launch.date_utc);
    
    if (launchDate > now) return 'planned';
    if (launch.success === false) return 'failed';
    if (launch.success === true) return 'completed';
    if (launch.upcoming === true) return 'planned';
    
    return 'completed';
  }

  static getFallbackMissions(): Mission[] {
    return [
      {
        id: 'apollo-11',
        name: 'Apollo 11',
        date: '1969-07-20T20:17:00.000Z',
        agency: 'NASA',
        type: 'landing',
        description: 'First crewed lunar landing mission. Neil Armstrong and Buzz Aldrin became the first humans to land on the Moon.',
        status: 'completed',
        target: 'Moon',
        crew: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'],
        rocket: 'Saturn V',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://cdn.mos.cms.futurecdn.net/8gzcR6RpGStvZFA2qRt4v6.jpg',
        missionPatch: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Apollo_11_insignia.png/256px-Apollo_11_insignia.png'
      },
      {
        id: 'voyager-1',
        name: 'Voyager 1',
        date: '1977-09-05T12:56:00.000Z',
        agency: 'NASA',
        type: 'flyby',
        description: 'Interplanetary probe studying the outer Solar System and now in interstellar space.',
        status: 'ongoing',
        target: 'Interstellar Space',
        rocket: 'Titan IIIE',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/09/voyager1-pia21895-16.jpg'
      },
      {
        id: 'perseverance',
        name: 'Mars 2020 Perseverance',
        date: '2020-07-30T11:50:00.000Z',
        agency: 'NASA',
        type: 'landing',
        description: 'Mars rover mission to search for signs of ancient microbial life and collect rock samples.',
        status: 'ongoing',
        target: 'Mars',
        rocket: 'Atlas V',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://mars.nasa.gov/system/news_items/main_images/8844_PIA23764-web.jpg'
      },
      {
        id: 'hubble',
        name: 'Hubble Space Telescope',
        date: '1990-04-24T12:33:00.000Z',
        agency: 'NASA',
        type: 'orbit',
        description: 'Space telescope that has revolutionized astronomy and provided incredible images of the universe.',
        status: 'ongoing',
        target: 'Earth Orbit',
        rocket: 'Space Shuttle Discovery',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/05/hubble-in-orbit-above-earth.jpg'
      },
      {
        id: 'cassini',
        name: 'Cassini-Huygens',
        date: '1997-10-15T08:43:00.000Z',
        agency: 'NASA/ESA',
        type: 'orbit',
        description: 'Mission to study Saturn and its moons, including the successful landing of Huygens probe on Titan.',
        status: 'completed',
        target: 'Saturn',
        rocket: 'Titan IV',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/cassini-saturn-pia08329.jpg'
      },
      {
        id: 'curiosity',
        name: 'Mars Science Laboratory',
        date: '2011-11-26T15:02:00.000Z',
        agency: 'NASA',
        type: 'landing',
        description: 'Curiosity rover mission to assess Mars past and present habitability.',
        status: 'ongoing',
        target: 'Mars',
        rocket: 'Atlas V',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://mars.nasa.gov/system/news_items/main_images/8812_1-PIA24542-web.jpg'
      },
      {
        id: 'new-horizons',
        name: 'New Horizons',
        date: '2006-01-19T19:00:00.000Z',
        agency: 'NASA',
        type: 'flyby',
        description: 'First mission to Pluto and the Kuiper Belt, providing detailed images of Pluto.',
        status: 'ongoing',
        target: 'Pluto',
        rocket: 'Atlas V',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/nh-pluto-in-true-color-2x-jpeg.jpg'
      },
      {
        id: 'juno',
        name: 'Juno',
        date: '2011-08-05T16:25:00.000Z',
        agency: 'NASA',
        type: 'orbit',
        description: 'Mission to study Jupiter composition, gravity field, magnetic field, and polar magnetosphere.',
        status: 'ongoing',
        target: 'Jupiter',
        rocket: 'Atlas V',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/jupiter-marble-pia22946.jpg'
      },
      {
        id: 'parker-solar-probe',
        name: 'Parker Solar Probe',
        date: '2018-08-12T07:31:00.000Z',
        agency: 'NASA',
        type: 'flyby',
        description: 'Mission to study the Sun corona and solar wind, flying closer to the Sun than any previous spacecraft.',
        status: 'ongoing',
        target: 'Sun',
        rocket: 'Delta IV Heavy',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/parker-solar-probe-pia22835.jpg'
      },
      {
        id: 'jwst',
        name: 'James Webb Space Telescope',
        date: '2021-12-25T12:20:00.000Z',
        agency: 'NASA/ESA/CSA',
        type: 'orbit',
        description: 'Next-generation space telescope designed to observe the universe in infrared light.',
        status: 'ongoing',
        target: 'L2 Lagrange Point',
        rocket: 'Ariane 5',
        launchSite: 'Kourou',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/04/webb-first-deep-field-smacs-0723.jpg'
      },
      {
        id: 'artemis-1',
        name: 'Artemis 1',
        date: '2022-11-16T06:47:00.000Z',
        agency: 'NASA',
        type: 'orbit',
        description: 'Uncrewed test flight of the Orion spacecraft around the Moon as part of the Artemis program.',
        status: 'completed',
        target: 'Moon',
        rocket: 'Space Launch System',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://blogs.nasa.gov/artemis/wp-content/uploads/sites/303/2022/11/artemis-1-launch-nov-16-2022.jpg'
      },
      {
        id: 'insight',
        name: 'InSight',
        date: '2018-05-05T11:05:00.000Z',
        agency: 'NASA',
        type: 'landing',
        description: 'Mars lander designed to study the deep interior of Mars and detect marsquakes.',
        status: 'completed',
        target: 'Mars',
        rocket: 'Atlas V',
        launchSite: 'Vandenberg',
        success: true,
        image: 'https://mars.nasa.gov/system/news_items/main_images/8843_PIA22743-web.jpg'
      },
      {
        id: 'osiris-rex',
        name: 'OSIRIS-REx',
        date: '2016-09-08T23:05:00.000Z',
        agency: 'NASA',
        type: 'sample_return',
        description: 'Mission to collect samples from asteroid Bennu and return them to Earth.',
        status: 'completed',
        target: 'Asteroid Bennu',
        rocket: 'Atlas V',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/bennu-mosaic-pia22486.jpg'
      },
      {
        id: 'lucy',
        name: 'Lucy',
        date: '2021-10-16T09:34:00.000Z',
        agency: 'NASA',
        type: 'flyby',
        description: 'Mission to study Jupiter Trojan asteroids to understand the formation of the solar system.',
        status: 'ongoing',
        target: 'Jupiter Trojans',
        rocket: 'Atlas V',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/lucy-spacecraft-pia24576.jpg'
      },
      {
        id: 'dart',
        name: 'DART',
        date: '2021-11-24T06:21:00.000Z',
        agency: 'NASA',
        type: 'flyby',
        description: 'Double Asteroid Redirection Test - first planetary defense mission to test asteroid deflection.',
        status: 'completed',
        target: 'Asteroid Dimorphos',
        rocket: 'Falcon 9',
        launchSite: 'Vandenberg',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/dart-impact-pia25224.jpg'
      },
      {
        id: 'crew-dragon-demo-2',
        name: 'Crew Dragon Demo-2',
        date: '2020-05-30T19:22:00.000Z',
        agency: 'SpaceX',
        type: 'crewed',
        description: 'First crewed flight of SpaceX Crew Dragon to the International Space Station.',
        status: 'completed',
        target: 'ISS',
        crew: ['Doug Hurley', 'Bob Behnken'],
        rocket: 'Falcon 9',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://www.spacex.com/static/images/crew/mission1_image.jpg'
      },
      {
        id: 'falcon-heavy-demo',
        name: 'Falcon Heavy Demo',
        date: '2018-02-06T20:45:00.000Z',
        agency: 'SpaceX',
        type: 'launch',
        description: 'First test flight of the Falcon Heavy rocket, launching a Tesla Roadster into space.',
        status: 'completed',
        target: 'Mars Orbit',
        rocket: 'Falcon Heavy',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://live.staticflickr.com/4615/40126461851_b15bf84c85_b.jpg'
      },
      {
        id: 'inspiration4',
        name: 'Inspiration4',
        date: '2021-09-15T20:02:00.000Z',
        agency: 'SpaceX',
        type: 'crewed',
        description: 'First all-civilian crew orbital mission, raising funds for St. Jude Children Research Hospital.',
        status: 'completed',
        target: 'Earth Orbit',
        crew: ['Jared Isaacman', 'Hayley Arceneaux', 'Chris Sembroski', 'Sian Proctor'],
        rocket: 'Falcon 9',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://live.staticflickr.com/65535/51471748936_8f8b8b8b8b_b.jpg'
      },
      {
        id: 'europa-clipper',
        name: 'Europa Clipper',
        date: '2024-10-14T12:06:00.000Z',
        agency: 'NASA',
        type: 'flyby',
        description: 'Mission to study Jupiter moon Europa and its subsurface ocean for potential habitability.',
        status: 'planned',
        target: 'Europa',
        rocket: 'Falcon Heavy',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/europa-clipper-pia25031.jpg'
      },
      {
        id: 'artemis-2',
        name: 'Artemis 2',
        date: '2025-11-01T00:00:00.000Z',
        agency: 'NASA',
        type: 'crewed',
        description: 'First crewed mission around the Moon since Apollo 17, testing systems for lunar landing.',
        status: 'planned',
        target: 'Moon',
        crew: ['Reid Wiseman', 'Victor Glover', 'Christina Hammock Koch', 'Jeremy Hansen'],
        rocket: 'Space Launch System',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://blogs.nasa.gov/artemis/wp-content/uploads/sites/303/2022/08/artemis-2-crew-announcement.jpg'
      },
      {
        id: 'iss-expedition-1',
        name: 'ISS Expedition 1',
        date: '2000-10-31T07:52:00.000Z',
        agency: 'NASA/Roscosmos',
        type: 'crewed',
        description: 'First long-duration crew to live aboard the International Space Station.',
        status: 'completed',
        target: 'ISS',
        crew: ['William Shepherd', 'Yuri Gidzenko', 'Sergei Krikalev'],
        rocket: 'Soyuz-U',
        launchSite: 'Baikonur',
        success: true,
        image: 'https://www.nasa.gov/wp-content/uploads/2023/03/iss-expedition-1-crew.jpg'
      },
      {
        id: 'viking-1',
        name: 'Viking 1',
        date: '1975-08-20T21:22:00.000Z',
        agency: 'NASA',
        type: 'landing',
        description: 'First successful U.S. mission to land on Mars and transmit data back to Earth.',
        status: 'completed',
        target: 'Mars',
        rocket: 'Titan IIIE',
        launchSite: 'Cape Canaveral',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/viking-1-mars-pia00571.jpg'
      },
      {
        id: 'galileo',
        name: 'Galileo',
        date: '1989-10-18T16:53:00.000Z',
        agency: 'NASA',
        type: 'orbit',
        description: 'First spacecraft to orbit Jupiter and study its moons in detail.',
        status: 'completed',
        target: 'Jupiter',
        rocket: 'Space Shuttle Atlantis',
        launchSite: 'Kennedy Space Center',
        success: true,
        image: 'https://science.nasa.gov/wp-content/uploads/2023/06/galileo-jupiter-pia00343.jpg'
      }
    ];
  }
}